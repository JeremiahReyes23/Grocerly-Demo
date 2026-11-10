'use strict';

/**
 * Grocerly v2 API — a safe, additive Supabase gateway.
 * No service-role credentials; every data request is authorized by a
 * verified Supabase access token and then enforced again by database RLS.
 *
 * This module does not replace insecure legacy routes. Do not enable public
 * signups until all old account-related endpoints have been retired.
 */
const express = require('express');

const TYPES = new Set(['inventory', 'recipes', 'trips', 'notifications', 'wasteLogs', 'calendar', 'customStores']);
const PROJECT_URL = process.env.SUPABASE_URL || 'https://qbmcsqvyeozgetznlgjc.supabase.co';

function createGrocerlyV2Router({ fetchImpl = fetch } = {}) {
  const router = express.Router();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
  const ready = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(PROJECT_URL)
    && publishableKey.length > 0;

  router.get('/status', (_req, res) => {
    res.json({ configured: ready, version: 'v2', authentication: 'supabase' });
  });

  // No anonymous email/id values are ever accepted as identity.
  router.use(async (req, res, next) => {
    if (!ready) return res.status(503).json({ error: 'Supabase is not configured' });
    const bearer = /^Bearer ([A-Za-z0-9_.-]+)$/.exec(req.get('authorization') || '');
    if (!bearer) return res.status(401).json({ error: 'Authentication required' });
    const token = bearer[1];
    try {
      const response = await fetchImpl(PROJECT_URL + '/auth/v1/user', {
        headers: { apikey: publishableKey, Authorization: 'Bearer ' + token },
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) return res.status(401).json({ error: 'Invalid or expired session' });
      const user = await response.json();
      if (!user || !/^[0-9a-f-]{36}$/i.test(user.id || '')) {
        return res.status(401).json({ error: 'Invalid authenticated user' });
      }
      req.grocerlyUser = { id: user.id, email: user.email };
      req.grocerlyToken = token;
      next();
    } catch (_error) {
      res.status(502).json({ error: 'Authentication service unavailable' });
    }
  });

  async function query(req, res, endpoint, { method = 'GET', body } = {}) {
    try {
      const response = await fetchImpl(PROJECT_URL + '/rest/v1/' + endpoint, {
        method,
        headers: {
          apikey: publishableKey,
          Authorization: 'Bearer ' + req.grocerlyToken,
          'Content-Type': 'application/json',
          Prefer: 'return=representation,resolution=merge-duplicates'
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(10000)
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) return res.status(response.status >= 500 ? 502 : response.status)
        .json({ error: 'Database request failed' });
      res.json(payload);
    } catch (_error) {
      res.status(502).json({ error: 'Database temporarily unavailable' });
    }
  }

  // Profile data is keyed exclusively to the verified token subject.
  router.get('/profile', async (req, res) => {
    const q = new URLSearchParams({ user_id: 'eq.' + req.grocerlyUser.id, select: 'display_name,household_size,preferences' });
    try {
      const response = await fetchImpl(PROJECT_URL + '/rest/v1/profiles?' + q.toString(), {
        headers: { apikey: publishableKey, Authorization: 'Bearer ' + req.grocerlyToken },
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) return res.status(502).json({ error: 'Profile fetch failed' });
      const data = await response.json();
      const profile = Array.isArray(data) ? data[0] : null;
      const allowed = profile?.preferences && typeof profile.preferences === 'object' ? profile.preferences : {};
      const { isAdmin: _admin, isPremium: _premium, ...preferences } = allowed;
      res.json({
        ...preferences, name: profile?.display_name || 'Grocerly Member',
        householdSize: profile?.household_size || 1, email: req.grocerlyUser.email, uid: req.grocerlyUser.id,
        isAdmin: false, isPremium: false
      });
    } catch (_error) {
      res.status(502).json({ error: 'Profile fetch unavailable' });
    }
  });

  router.put('/profile', async (req, res) => {
    const profile = req.body?.profile;
    if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
      return res.status(400).json({ error: 'Profile is required' });
    }
    const householdSize = Number(profile.householdSize || 1);
    if (!Number.isInteger(householdSize) || householdSize < 1 || householdSize > 100) {
      return res.status(400).json({ error: 'Invalid household size' });
    }
    const { email, uid, userId, isAdmin, isPremium, name, householdSize: ignored, ...preferences } = profile;
    if (JSON.stringify(preferences).length > 100000) return res.status(413).json({ error: 'Profile too large' });
    return query(req, res, 'profiles?on_conflict=user_id', {
      method: 'POST',
      body: {
        user_id: req.grocerlyUser.id,
        display_name: String(name || 'Grocerly Member').slice(0, 120),
        household_size: householdSize,
        preferences,
        updated_at: new Date().toISOString()
      }
    });
  });

  router.get('/me', (req, res) => {
    res.json({ id: req.grocerlyUser.id, email: req.grocerlyUser.email });
  });

  router.get('/documents/:type', (req, res) => {
    if (!TYPES.has(req.params.type)) return res.status(404).json({ error: 'Unknown document' });
    const q = new URLSearchParams({
      user_id: 'eq.' + req.grocerlyUser.id,
      document_type: 'eq.' + req.params.type,
      select: 'payload,updated_at'
    });
    return query(req, res, 'user_documents?' + q.toString());
  });

  router.put('/documents/:type', (req, res) => {
    if (!TYPES.has(req.params.type)) return res.status(404).json({ error: 'Unknown document' });
    const payload = req.body?.payload;
    if (payload === undefined || payload === null || typeof payload !== 'object') {
      return res.status(400).json({ error: 'A JSON payload is required' });
    }
    if (JSON.stringify(payload).length > 250000) {
      return res.status(413).json({ error: 'Document too large' });
    }
    const q = new URLSearchParams({ on_conflict: 'user_id,document_type' });
    return query(req, res, 'user_documents?' + q.toString(), {
      method: 'POST',
      body: {
        user_id: req.grocerlyUser.id,
        document_type: req.params.type,
        payload,
        updated_at: new Date().toISOString()
      }
    });
  });

  return router;
}

module.exports = { createGrocerlyV2Router };
