import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const ORIGIN = process.env.GROCERLY_URL || 'http://127.0.0.1:3000';
const viewports = [
  { width: 320, height: 568 }, { width: 390, height: 844 },
  { width: 768, height: 1024 }, { width: 1024, height: 768 },
  { width: 1440, height: 900 }, { width: 1920, height: 1080 },
];
const screens = [
  ['Home', 'dashboard'], ['Meals', 'meals'],
  ['Groceries', 'inventory'], ['Settings', 'profile'],
];
await mkdir('test-artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.GROCERLY_CHROME_PATH || undefined, args: ['--no-sandbox'] });
const errors = [];
const visualDiagnostics = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      localStorage.setItem('grocerly_logged_in', 'true');
      localStorage.setItem('grocerly_first_launch', 'false');
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(viewport.width + 'px: ' + error.message));
    await page.goto(ORIGIN, { waitUntil: 'domcontentloaded' });
    await page.locator('#page-dashboard.active').waitFor({ timeout: 15000 });
    for (const [screen, tab] of screens) {
      await page.locator(`#app-bottom-nav .nav-item[data-tab="${tab}"]`).click();
      await page.locator(`#page-${tab}.active`).waitFor();
      await page.waitForTimeout(550);
      const bounds = await page.evaluate(() => {
        const header = document.querySelector('.grocerly-global-header');
        const nav = document.querySelector('#app-bottom-nav');
        const activePage = document.querySelector('.page.active');
        const inspect = el => {
          const r = el.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
        };
        return {
          width: window.innerWidth,
          header: inspect(header), nav: inspect(nav), active: inspect(activePage),
          navItems: [...nav.querySelectorAll('.nav-item')].map(inspect),
          horizontalOverflow: Math.max(0, activePage.scrollWidth - activePage.clientWidth)
        };
      });
      // Wide browsers use a centered, compact reference-proportioned app.
      // Header, pages, and dock must be aligned to the SAME visible frame.
      if (viewport.width >= 621) {
        const shell = await page.evaluate(() => {
          const frame = document.querySelector(".device-wrapper").getBoundingClientRect();
          const header = document.querySelector(".grocerly-global-header").getBoundingClientRect();
          const nav = document.querySelector("#app-bottom-nav").getBoundingClientRect();
          const active = document.querySelector(".page.active").getBoundingClientRect();
          const content = [...document.querySelectorAll(".page.active > .grocerly-quick-panel, .page.active > .header-bar, .page.active .grocerly-profile-scroll")].map(el=>el.getBoundingClientRect()).find(rect=>rect.width>0 && rect.height>0);
          return {frame:{left:frame.left,right:frame.right,width:frame.width},
            header:{left:header.left,right:header.right},
            nav:{left:nav.left,right:nav.right},
            page:{left:active.left,right:active.right},
            content:content?{left:content.left,right:content.right}:null};
        });
        assert(shell.frame.width <= 662, `${screen} desktop app too wide at ${viewport.width}: ${JSON.stringify(shell)}`);
        assert(Math.abs(shell.frame.left - (viewport.width-shell.frame.width)/2) <= 4, `${screen} compact app not centered at ${viewport.width}: ${JSON.stringify(shell)}`);
        assert(shell.header.left >= shell.frame.left+10 && shell.header.right <= shell.frame.right-10, `${screen} header misaligned with app at ${viewport.width}: ${JSON.stringify(shell)}`);
        assert(Math.abs(shell.nav.left-shell.frame.left)<=3 && Math.abs(shell.nav.right-shell.frame.right)<=3, `${screen} dock does not align with app at ${viewport.width}: ${JSON.stringify(shell)}`);
        assert(Math.abs(shell.page.left-shell.frame.left)<=3 && Math.abs(shell.page.right-shell.frame.right)<=3, `${screen} page not sized to compact app at ${viewport.width}: ${JSON.stringify(shell)}`);
        if(shell.content) assert(shell.content.left >= shell.frame.left+16 && shell.content.right <= shell.frame.right-16, `${screen} content not aligned to app gutters at ${viewport.width}: ${JSON.stringify(shell)}`);
      }
      if (tab === "inventory" && viewport.width >= 621) {
        const groceryHeader = await page.evaluate(() => {
          const total = document.querySelector("#inventory-total-price").getBoundingClientRect();
          const add = document.querySelector("#btn-inventory-add-trigger").getBoundingClientRect();
          const heading = document.querySelector(".grocerly-inventory-heading").getBoundingClientRect();
          return {total:{left:total.left,top:total.top,right:total.right},add:{left:add.left,top:add.top,right:add.right},heading:{left:heading.left,top:heading.top,right:heading.right}};
        });
        assert(Math.abs(groceryHeader.total.top - groceryHeader.add.top) <= 18,
          `Groceries total and Add should share the reference row at ${viewport.width}: ${JSON.stringify(groceryHeader)}`);
        assert(groceryHeader.heading.right <= groceryHeader.total.left + 2 &&
               groceryHeader.total.right <= groceryHeader.add.left + 2,
          `Groceries heading/total/Add overlap at ${viewport.width}: ${JSON.stringify(groceryHeader)}`);
      }

      if (tab === 'meals' || tab === 'inventory') {
        const row = await page.evaluate(tab => {
          const node = document.querySelector(tab === 'meals' ? '#meal-type-filter-chips' : '.grocerly-category-filters');
          const buttons = [...node.children];
          const parent = node.getBoundingClientRect();
          return {
            total: buttons.length,
            scrollDifference: node.scrollWidth-node.clientWidth,
            rowHeight: parent.height,
            allVisible: buttons.every(button => {
              const r=button.getBoundingClientRect();
              return r.width>=36 && r.height>=30 && r.left>=parent.left-2 && r.right<=parent.right+2 &&
                r.top>=parent.top-2 && r.bottom<=parent.bottom+2;
            })
          };
        }, tab);
        assert(row.total === (tab === 'meals' ? 4 : 7),
          screen + ' wrong filter count: '+JSON.stringify(row));
        assert(row.scrollDifference <= 3 && row.allVisible,
          screen + ' food filters should all be visible with no sideways scrolling at '+viewport.width+': '+JSON.stringify(row));
      }
      if (tab === 'dashboard' && [390,1440].includes(viewport.width)) {
        const pencil = page.locator('#btn-edit-lifespan-trigger');
        await pencil.click();
        await page.locator('#modal-edit-lifespan.active').waitFor();
        await page.locator('#edit-lifespan-days').fill('21');
        await page.locator('#btn-lifespan-save').click();
        await page.waitForFunction(() => document.querySelector('#stat-duration-val')?.textContent?.trim().startsWith('21 days'));
        const weeks = await page.evaluate(() => State.user.desiredStorageWeeks);
        assert(Math.abs(weeks-3)<0.0001,'Edited Lifespan not saved as 21 days: '+weeks);
        await pencil.click();
        await page.locator('#edit-lifespan-days').fill('14');
        await page.locator('#btn-lifespan-save').click();
      }
      if ((tab==='meals' || tab==='inventory') && [390,1440].includes(viewport.width)) {
        await page.evaluate(() => document.body.classList.add('dark-theme'));
        const buttons = await page.evaluate(tab => {
          const rgb = color => [...(color.match(/[\d.]+/g)||[])].slice(0,3).map(Number);
          const lum=vals=>vals.map(c=>{c/=255;return c<.04045?c/12.92:((c+.055)/1.055)**2.4})
            .reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
          const selectors=tab==='meals'?
            ['#meal-type-filter-chips .filter-chip.active','#meal-type-filter-chips .filter-chip:not(.active)','#btn-meals-ideas-trigger','#btn-meals-create-trigger']:
            ['.grocerly-category-filters button[aria-pressed="true"]','.grocerly-category-filters button[aria-pressed="false"]','#inventory-total-price','#btn-inventory-add-trigger'];
          return selectors.map(selector=>{
            const st=getComputedStyle(document.querySelector(selector));
            const a=lum(rgb(st.color)),b=lum(rgb(st.backgroundColor));
            return {selector,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),fg:st.color,bg:st.backgroundColor};
          });
        },tab);
        for(const button of buttons) assert(button.contrast >= 4.5,
          'Low-contrast dark-mode control '+viewport.width+': '+JSON.stringify(button));
        await page.screenshot({path:'test-artifacts/'+viewport.width+'-'+tab+'-dark.png',fullPage:false});
        await page.evaluate(() => document.body.classList.remove('dark-theme'));
      }

      assert(bounds.header.left >= -2 && bounds.header.right <= viewport.width + 2, `${screen} header overflow at ${viewport.width}`);
      assert(bounds.nav.left >= -2 && bounds.nav.right <= viewport.width + 2, `${screen} bottom nav overflow at ${viewport.width}`);
      for (const item of bounds.navItems) assert(item.width >= 40 && item.right <= viewport.width + 2, `${screen} nav item clipped at ${viewport.width}`);
      assert(bounds.horizontalOverflow <= 4, `${screen} page horizontal overflow ${bounds.horizontalOverflow}px at ${viewport.width}`);
      // Every main screen is exactly one viewport tall. Only its data panel scrolls.
      const viewportFrame = await page.evaluate(activeTab => {
        const active = document.querySelector('.page.active');
        const nav = document.querySelector('#app-bottom-nav');
        const select = {
          dashboard: '#dash-grocery-list-dropdown .grocery-table-wrapper',
          meals: '#recipes-list-container',
          inventory: '#inventory-list-container',
          profile: '.grocerly-profile-scroll'
        };
        const inner = active.querySelector(select[activeTab]);
        const rect = inner?.getBoundingClientRect();
        const navigation = nav.getBoundingClientRect();
        window.scrollTo(0, 200);
        active.scrollTop = 200;
        return {
          windowScrollY: window.scrollY,
          pageScrollTop: active.scrollTop,
          pageOverflow: Math.max(0, active.scrollHeight - active.clientHeight),
          documentOverflow: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
          innerOverflowY: inner ? getComputedStyle(inner).overflowY : null,
          innerHeight: inner ? inner.clientHeight : -1,
          innerTop: rect?.top,
          innerBottom: rect?.bottom,
          navTop: navigation.top
        };
      }, tab);
      assert(viewportFrame.windowScrollY === 0, `${screen} scrolls the document at ${viewport.width}px: ${JSON.stringify(viewportFrame)}`);
      assert(viewportFrame.pageScrollTop === 0, `${screen} scrolls the whole page at ${viewport.width}px: ${JSON.stringify(viewportFrame)}`);
      assert(viewportFrame.pageOverflow <= 3, `${screen} page contents overflow the viewport at ${viewport.width}px: ${JSON.stringify(viewportFrame)}`);
      assert(viewportFrame.documentOverflow <= 3, `${screen} document height exceeds the viewport at ${viewport.width}px: ${JSON.stringify(viewportFrame)}`);
      assert((tab==='profile' ? viewportFrame.innerOverflowY==='hidden' : ['auto', 'scroll'].includes(viewportFrame.innerOverflowY)), `${screen} missing contained scrolling at ${viewport.width}px: ${JSON.stringify(viewportFrame)}`);
      assert(viewportFrame.innerHeight >= 15, `${screen} inner content panel collapsed at ${viewport.width}px: ${JSON.stringify(viewportFrame)}`);
      assert(viewportFrame.innerBottom <= viewportFrame.navTop + 3, `${screen} inner content overlaps bottom navigation at ${viewport.width}px: ${JSON.stringify(viewportFrame)}`);
            const titleGap = await page.evaluate(activeTab => {
        const titleSelector = activeTab === 'dashboard' ? '#dash-welcome-text'
          : activeTab === 'meals' || activeTab === 'inventory' ? '#page-' + activeTab + ' .header-bar'
          : '#page-profile .grocerly-profile-identity > h1';
        const target = document.querySelector(titleSelector);
        const brand = document.querySelector('.grocerly-global-brand');
        if (!target || !brand) return null;
        return target.getBoundingClientRect().top - brand.getBoundingClientRect().bottom;
      }, tab);
      assert(titleGap !== null && titleGap >= 8, `${screen} starts behind the Grocerly brand at ${viewport.width}px: gap ${titleGap}`);

      if (tab === 'profile') {
        const layout = await page.evaluate(() => {
          const panel = document.querySelector('#page-profile .grocerly-profile-scroll');
          const identity = document.querySelector('#page-profile .grocerly-profile-identity');
          const heading = identity?.querySelector('h1')?.getBoundingClientRect();
          const avatar = identity?.querySelector('#profile-card-img')?.getBoundingClientRect();
          const signout = document.querySelector('#page-profile #btn-logout')?.getBoundingClientRect();
          const nav = document.querySelector('#app-bottom-nav')?.getBoundingClientRect();
          panel.scrollTop = 100;
          return {
            scrollHeight:panel.scrollHeight,clientHeight:panel.clientHeight,scrollTop:panel.scrollTop,
            heading:heading?{left:heading.left,right:heading.right,top:heading.top}:null,
            avatar:avatar?{left:avatar.left,right:avatar.right,top:avatar.top}:null,
            signoutBottom:signout?.bottom,navTop:nav?.top,
            visibleRows:[...document.querySelectorAll('#page-profile .settings-list > .settings-item')]
              .filter(row=>getComputedStyle(row).display!=='none').length
          };
        });
        assert(layout.scrollHeight <= layout.clientHeight+3,
          'Profile must fit without internal scrolling at '+viewport.width+': '+JSON.stringify(layout));
        assert(layout.scrollTop===0,
          'Profile must stay fixed at '+viewport.width+': '+JSON.stringify(layout));
        assert(layout.heading && layout.avatar && layout.heading.right <= layout.avatar.left+2,
          'Profile avatar overlaps heading at '+viewport.width+': '+JSON.stringify(layout));
        assert(layout.signoutBottom <= layout.navTop-3,
          'Sign Out overlaps the navigation at '+viewport.width+': '+JSON.stringify(layout));
        assert(layout.visibleRows===4,
          'Profile must show four settings options at '+viewport.width+': '+JSON.stringify(layout));
      }

      if ((tab==='meals' || tab==='inventory') && [390,1440].includes(viewport.width)) {
        const empty = await page.evaluate(tab => {
          const parent=document.querySelector(tab==='meals'?'#recipes-list-container':'#inventory-list-container');
          const card=parent?.querySelector('.empty-state-card');
          if(!card)return null;
          return {parent:parent.getBoundingClientRect().width,card:card.getBoundingClientRect().width};
        },tab);
        if(empty) assert(empty.card>=empty.parent*0.80,
          screen+' empty-state should span collection at '+viewport.width+': '+JSON.stringify(empty));
      }

      if(tab==='meals' && [390,1440].includes(viewport.width)){
        const search=page.locator('#recipe-search-input');
        await search.fill('grocerly__no_matching_recipes__2026');
        await page.locator('#recipes-list-container > .empty-state-card').waitFor();
        const emptyFrame=await page.evaluate(()=>{
          const container=document.querySelector('#recipes-list-container').getBoundingClientRect();
          const card=document.querySelector('#recipes-list-container > .empty-state-card').getBoundingClientRect();
          return {width:container.width,cardWidth:card.width,cardLeft:card.left,containerLeft:container.left};
        });
        assert(emptyFrame.cardWidth >= emptyFrame.width-35,
          'Meal empty state should extend across entire panel: '+JSON.stringify(emptyFrame));
        await page.screenshot({path:'test-artifacts/'+viewport.width+'-meals-empty.png',fullPage:false});
        await search.fill('');
      }

      if(tab==='dashboard' && [390,1440].includes(viewport.width)){
        await page.evaluate(()=>document.body.classList.add('dark-theme'));
        const contrast=await page.evaluate(()=>{
          const parse = color => (color.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
          const lum = values => values.map(c=>{c/=255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4})
            .reduce((sum,value,i)=>sum+value*[0.2126,0.7152,0.0722][i],0);
          const pageBg=getComputedStyle(document.querySelector('#page-dashboard')).backgroundColor;
          const heading=getComputedStyle(document.querySelector('#dash-welcome-text')).color;
          const a=lum(parse(pageBg)),b=lum(parse(heading));
          const loaded=[...document.styleSheets].filter(sheet=>sheet.href?.includes('grocerly-polish.css')).map(sheet=>({href:sheet.href,rules:sheet.cssRules.length,hasRule:[...sheet.cssRules].some(rule=>rule.selectorText?.includes('body.dark-theme #page-dashboard #dash-welcome-text'))}));
          return {ratio:(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05),pageBg,heading,loaded,
            dark:document.body.classList.contains('dark-theme'),
            ink:getComputedStyle(document.body).getPropertyValue('--grocerly-ink'),
            matching:document.querySelectorAll('body.dark-theme #page-dashboard #dash-welcome-text').length,
            inline:document.querySelector('#dash-welcome-text').getAttribute('style'),
            varAtHeading:getComputedStyle(document.querySelector('#dash-welcome-text')).getPropertyValue('--grocerly-ink'),
            matchedRules:[...document.styleSheets].filter(x=>x.href&&x.href.includes('grocerly')).flatMap(sheet=>[...sheet.cssRules]
              .filter(rule=>rule.selectorText&&rule.selectorText.includes('dash-welcome-text'))
              .map(rule=>({sheet:sheet.href.split('/').pop(),selector:rule.selectorText,
                matches:document.querySelector('#dash-welcome-text').matches(rule.selectorText),
                color:rule.style?.getPropertyValue('color'),priority:rule.style?.getPropertyPriority('color')}))).filter(x=>x.color)};
        });
        assert(contrast.ratio>=4.5,
          'Dark-mode Home greeting contrast insufficient at '+viewport.width+': '+JSON.stringify(contrast));
        await page.screenshot({path: 'test-artifacts/'+viewport.width+'-home-dark.png', fullPage: false});
        await page.evaluate(()=>document.body.classList.remove('dark-theme'));
      }

      if(tab==='profile' && [390,1440].includes(viewport.width)){
        await page.locator('#grocerly-language-switch [data-lang="es"]').click();
        await page.waitForFunction(()=>[...document.querySelectorAll('#page-profile .settings-item-left span')]
          .some(span=>span.textContent.trim()==='Tema oscuro'));
        assert.equal(await page.locator('#page-profile .grocerly-profile-identity h1').innerText(),'Mi perfil');
        assert((await page.locator('#page-profile #btn-logout').innerText()).includes('Cerrar sesión'));
        assert.equal(await page.evaluate(()=>document.documentElement.lang),'es');
        await page.screenshot({path:'test-artifacts/'+viewport.width+'-settings-es.png',fullPage:false});
        // Verify EN/ES applies to the four main screens, not just Settings.
        const checks=[
          {tab:'dashboard',selector:'#page-dashboard .grocerly-plan-heading',expected:'Tu plan de compras actual'},
          {tab:'meals',selector:'#page-meals .meals-intro h1',expected:'Mi plan de comidas'},
          {tab:'inventory',selector:'#page-inventory .grocerly-inventory-heading h1',expected:'Mis compras'},
        ];
        for(const check of checks){
          await page.locator('#app-bottom-nav .nav-item[data-tab="'+check.tab+'"]').click();
          await page.locator('#page-'+check.tab+'.active').waitFor();
          await page.waitForFunction(({selector,expected})=>
            document.querySelector(selector)?.textContent?.trim()===expected,check);
          const empty=page.locator('#page-'+check.tab+' .empty-state-card');
          if(await empty.count() && check.tab==='meals'){
            assert((await empty.innerText()).includes('Tu plan de comidas está vacío'),'Meal empty state untranslated');
          }
          if(await empty.count() && check.tab==='inventory'){
            assert((await empty.innerText()).includes('Tu despensa está vacía'),'Pantry empty state untranslated');
          }
        }
        await page.locator('#app-bottom-nav .nav-item[data-tab="profile"]').click();
        await page.locator('#page-profile.active').waitFor();
        await page.locator('#grocerly-language-switch [data-lang="en"]').click();
        await page.waitForFunction(()=>[...document.querySelectorAll('#page-profile .settings-item-left span')]
          .some(span=>span.textContent.trim()==='Dark Theme'));
      }

      if ([390,1440].includes(viewport.width)) {
        visualDiagnostics.push(await page.evaluate((view) => {
          const pick = ['.recipe-card','.recipe-card-title','.recipe-card-desc','.recipe-ingredients-check',
            '.inv-card','.inv-card-header','.inv-card-name','.inv-card-life','.inv-card-stock'];
          const sample = Object.fromEntries(pick.map(selector => {
            const e = document.querySelector('#page-' + view.tab + ' ' + selector);
            if (!e) return [selector,null];
            const style = getComputedStyle(e), rect=e.getBoundingClientRect();
            return [selector,{text:e.textContent.trim().slice(0,120),html:e.outerHTML.slice(0,360),
              display:style.display,visibility:style.visibility,opacity:style.opacity,color:style.color,
              position:style.position,rect:{x:rect.x,y:rect.y,w:rect.width,h:rect.height}}];
          }));
          const active=document.querySelector('#page-' + view.tab);
          const globalHeader=document.querySelector('.grocerly-global-header');
          const firstContent=active?.querySelector('.header-bar,#dash-welcome-text,h1,.grocerly-profile-intro');
          function summary(el) {
            if(!el)return null;
            const c=getComputedStyle(el),r=el.getBoundingClientRect();
            return {tag:el.tagName,cls:el.className,paddingTop:c.paddingTop,paddingBottom:c.paddingBottom,
              marginTop:c.marginTop,marginBottom:c.marginBottom,display:c.display,position:c.position,
              top:c.top,height:c.height,scrollTop:el.scrollTop,scrollHeight:el.scrollHeight,
              bounds:{x:r.x,y:r.y,w:r.width,h:r.height}};
          }
          return {width:view.width,screen:view.screen,sample,layout:{
            active:summary(active),globalHeader:summary(globalHeader),firstContent:summary(firstContent),
            viewportScrollY:window.scrollY
          }};
        }, {width:viewport.width,tab,screen}));
      }
      if ([390,768,1024,1440,1920].includes(viewport.width)) {
        await page.screenshot({ path: `test-artifacts/${viewport.width}-${screen.toLowerCase()}.png`, fullPage: false });
      }
      console.log(`${viewport.width}×${viewport.height} ${screen}: OK`);
    }
    await context.close();
  }

  await writeFile('test-artifacts/diagnostics.json', JSON.stringify(visualDiagnostics, null, 2));

  // No onboarding: actual email/password account registration ends on Home.
  const authContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await authContext.newPage();
  page.on('pageerror', error => errors.push('auth: ' + error.message));
  await page.goto(ORIGIN, { waitUntil: 'domcontentloaded' });
  await page.locator('#page-login.active').waitFor({ timeout: 12000 });
  await page.locator('#login-email').fill(`ui-check-${Date.now()}@example.invalid`);
  await page.locator('#login-password').fill('test-only-password-9841');
  await page.locator('#btn-login-signup').click();
  await page.locator('#page-dashboard.active').waitFor({ timeout: 15000 });
  assert.equal(await page.locator('#page-profile-setup.active, #page-goals.active, #page-dynamic-questions.active').count(), 0);
  console.log('Registration redirects directly to Home: OK');
  await authContext.close();
  assert.deepEqual(errors, [], 'Uncaught browser errors: ' + errors.join(' | '));
} finally {
  await browser.close();
}