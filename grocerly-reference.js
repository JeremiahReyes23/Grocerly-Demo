/* Grocerly reference design behavior.
   DOM rearrangement preserves original app.js event handlers and stored data. */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  function initialize(){
    const dashboard=$("page-dashboard");
    const inventory=$("page-inventory");
    const profile=$("page-profile");
    const meals=$("page-meals");

    // Match the three actions shown in the supplied home design.
    const actions=dashboard?.querySelectorAll(".grocerly-quick-action span");
    if(actions?.length===3){
      actions[0].textContent="Scan Receipt";
      actions[1].textContent="Build Meals";
      actions[2].textContent="My Groceries";
    }

    // Export the actual current inventory; replace the old "Meals" shortcut with a useful download.
    const download=$("btn-dash-go-meals");
    if(download){
      download.addEventListener("click",function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        const products=Array.isArray(State?.inventory)?State.inventory:[];
        const header=["Ingredient","Quantity","Unit","Storage","Status","Price"];
        function csv(value){
          let text=String(value===undefined||value===null?"":value);
          if(/^[\s]*[=+\-@]/.test(text))text="'"+text; // Prevent spreadsheet formula execution.
          return '"'+text.replace(/"/g,'""')+'"';
        }
        const rows=products.map(item=>{
          const days=item.expiryDate?Math.ceil((new Date(item.expiryDate)-new Date())/86400000):null;
          const status=days===null?"Not entered":days<=0?"Date passed":days<=2?"Use soon":days+" days left";
          return [item.name,item.currentQty,item.unit,item.storageLoc,status,(Number(item.price)||0).toFixed(2)].map(csv).join(",");
        });
        const blob=new Blob(["\uFEFF"+header.map(csv).join(",")+"\r\n"+rows.join("\r\n")],{type:"text/csv;charset=utf-8"});
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");a.href=url;a.download="grocerly-list-"+new Date().toISOString().slice(0,10)+".csv";
        document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      },true);
    }

    // UI-only category presets. The original inventory search, sorting and detailed filters still work.
    if(inventory&&typeof window.refreshInventoryList==="function"){
      const old=window.refreshInventoryList;
      let category="All";
      const fruit=/\b(apple|banana|orange|berry|berries|grape|melon|mango|peach|pear|cherry|kiwi|pineapple|lemon|lime|strawberr|blueberr|raspberr|plum|avocado|plantain|papaya|coconut)\b/i;
      const grain=/\b(rice|bread|pasta|cereal|oat|wheat|tortilla|flour|granola|quinoa|barley|grain|cornmeal|cracker|noodle|bagel)\b/i;
      const protein=/\b(chicken|beef|pork|turkey|fish|salmon|tuna|shrimp|egg|tofu|bean|lentil|chickpea|sausage|steak|meat|tempeh)\b/i;
      const herb=/\b(herb|basil|oregano|parsley|cilantro|rosemary|thyme|spice|cumin|pepper powder|garlic powder|paprika|mint|cinnamon)\b/i;
      function matches(item){
        const name=item.name||"",cat=(item.category||"").toLowerCase();
        if(category==="All")return true;
        if(category==="Fruits")return fruit.test(name) && /produce|fruit/i.test(cat);
        if(category==="Vegetables")return /produce|vegetable/i.test(cat) && !fruit.test(name);
        if(category==="Grains")return cat==="bakery" || grain.test(name);
        if(category==="Protein")return /meat|poultry|seafood|protein/i.test(cat) || protein.test(name);
        if(category==="Dairy")return /dairy/i.test(cat) || /\b(milk|cheese|yogurt|butter|cream)\b/i.test(name);
        if(category==="Herbs")return /spice|herb/i.test(cat) || herb.test(name);
        return true;
      }
      function showMatching(){
        const cards=inventory.querySelectorAll("#inventory-list-container .inv-card");
        let visible=0,total=0;
        cards.forEach(card=>{
          const item=State?.inventory?.find(value=>String(value.id)===String(card.dataset.id));
          const show=!!item&&matches(item);
          card.hidden=!show;
          if(show){visible++;total+=Number(item.price)||0;}
        });
        const count=$("inventory-total-label");
        if(count)count.textContent=visible+" item"+(visible===1?"":"s")+" in storage";
        const totalEl=$("inventory-total-price");
        if(totalEl)totalEl.textContent="Total: "+(typeof formatCurrency==="function"?formatCurrency(total):"$"+total.toFixed(2));
      }
      window.refreshInventoryList=function(){
        const result=old.apply(this,arguments);
        showMatching();
        return result;
      };
      const bar=document.createElement("div");
      bar.className="grocerly-category-filters";
      bar.setAttribute("role","group");bar.setAttribute("aria-label","Filter groceries");
      ["All","Vegetables","Fruits","Grains","Protein","Dairy","Herbs"].forEach(label=>{
        const button=document.createElement("button");button.type="button";button.textContent=label;
        button.setAttribute("aria-pressed",String(label==="All"));
        button.addEventListener("click",()=>{
          category=label;
          bar.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
          window.refreshInventoryList();
        });
        bar.appendChild(button);
      });
      inventory.querySelector(".search-filter-row")?.insertAdjacentElement("afterend",bar);
      showMatching();
    }

    // Keep receipt import prominent; move optional manual entry/product photo to a compact disclosure.
    if(inventory){
      const panel=inventory.querySelector(".grocerly-product-panel");
      const manual=inventory.querySelector(".grocerly-manual-add");
      const exportBtn=$("btn-inventory-export-lists");
      const doneBtn=$("btn-inventory-done-shopping");
      if(panel||manual){
        const details=document.createElement("details");details.className="grocerly-add-options";
        const summary=document.createElement("summary");summary.textContent="Other ways to add";
        details.appendChild(summary);
        const row=document.createElement("div");row.className="grocerly-secondary-actions";
        details.appendChild(row);
        if(manual)row.appendChild(manual);
        if(exportBtn)row.appendChild(exportBtn);
        if(doneBtn)row.appendChild(doneBtn);
        if(panel)details.appendChild(panel);
        inventory.querySelector(".header-bar")?.insertAdjacentElement("afterend",details);
      }
    }

    // Show profile avatar near the heading, and make the name editable.
    if(profile){
      const nameInput=$("profile-settings-name");
      function fillName(){
        if(nameInput&&document.activeElement!==nameInput&&typeof State!=="undefined")nameInput.value=State?.user?.name||"";
      }
      fillName();
      if(nameInput){
        nameInput.addEventListener("change",()=>{
          const next=nameInput.value.trim().slice(0,90);
          if(!next){fillName();return;}
          if(State?.user)State.user.name=next;
          if(typeof saveStateToStorage==="function")saveStateToStorage();
          if(typeof ClientAPI!=="undefined"&&typeof ClientAPI.syncBackend==="function")ClientAPI.syncBackend();
          if(typeof refreshProfileCard==="function")refreshProfileCard();
          if(typeof refreshDashboard==="function")refreshDashboard();
        });
      }
      const settings=profile.querySelector(".settings-list");
      if(settings){
        const dark=settings.querySelector(".settings-item:has(#dark-theme-toggle)");
        const currency=settings.querySelector(".settings-item:has(#profile-currency-select)");
        const ai=$("grocerly-ai-setting");
        const feedback=$("btn-profile-submit-feedback");
        const primary=[dark,currency,ai,feedback].filter(Boolean);
        const more=document.createElement("details");more.className="grocerly-advanced-settings";
        const summary=document.createElement("summary");summary.textContent="More options";
        more.appendChild(summary);
        [...settings.children].filter(child=>!primary.includes(child)).forEach(child=>more.appendChild(child));
        const tools=document.createElement("div");tools.className="grocerly-more-tools";
        const shortcuts=[
          {icon:"fa-chart-simple",label:"Insights",page:"analytics"},
          {icon:"fa-receipt",label:"Scan receipt",page:"groceries"},
          {icon:"fa-bell",label:"Notifications",trigger:"btn-dashboard-notifs"}
        ];
        shortcuts.forEach(opt=>{
          const btn=document.createElement("button");btn.type="button";
          btn.className="settings-item grocerly-tool-link";
          btn.innerHTML='<span class="settings-item-left"><i class="fas '+opt.icon+'" aria-hidden="true"></i><span>'+opt.label+'</span></span><i class="fas fa-chevron-right" aria-hidden="true"></i>';
          btn.addEventListener("click",()=>{
            if(opt.page) {
              const tab=opt.page==="groceries"?"inventory":opt.page;
              if(typeof transitionToPage==="function")transitionToPage("page-"+opt.page);
              if(typeof State!=="undefined")State.activeTab=tab;
              if(opt.page==="groceries"&&typeof refreshPurchasesFolders==="function")refreshPurchasesFolders();
              if(opt.page==="analytics"&&typeof renderAnalyticsCharts==="function")renderAnalyticsCharts();
              document.querySelectorAll("#app-bottom-nav .nav-item").forEach(item=>item.classList.toggle("active",item.dataset.tab===tab));
            }
            if(opt.trigger)$(opt.trigger)?.click();
          });
          tools.appendChild(btn);
        });
        more.appendChild(tools);
        primary.forEach(child=>settings.appendChild(child));
        settings.appendChild(more);
      }
      // The fourth reference setting is an actual AI on/off preference, not an extra menu.
      const aiPermission=$("grocerly-ai-permission");
      if(aiPermission){
        const key=()=> "grocerly_ai_features_" + (typeof State!=="undefined" && State.user?.email || "default");
        const isEnabled=()=> localStorage.getItem(key())!=="false";
        aiPermission.checked=isEnabled();
        aiPermission.addEventListener("change",()=>{
          localStorage.setItem(key(),String(aiPermission.checked));
          if(!aiPermission.checked) $("modal-ai-assistant")?.classList.remove("active");
        });
        if(typeof ClientAPI!=="undefined"&&typeof ClientAPI.request==="function"){
          const originalRequest=ClientAPI.request.bind(ClientAPI);
          ClientAPI.request=function(endpoint,method,body){
            if(typeof endpoint==="string" && /^\/api\/ai(?:\/|\?|$)/.test(endpoint) && !isEnabled()){
              return Promise.reject(new Error("AI features are switched off in Settings."));
            }
            return originalRequest(endpoint,method,body);
          };
        }
        document.addEventListener("click",event=>{
          const button=event.target.closest("#btn-dashboard-ai,#btn-meals-ideas-trigger");
          if(button&&!isEnabled()){
            event.preventDefault();event.stopImmediatePropagation();
            if(typeof showToast==="function")showToast("Enable AI Integration Perms in Settings first.","info");
          }
        },true);
      }

      // Preserve the existing admin feature in Settings, rather than the bottom dock.
      const admin=$("admin-toggle-container");
      if(admin){
        const adminGo=document.createElement("button");
        adminGo.type="button";adminGo.id="nav-item-admin";
        adminGo.className="settings-item";adminGo.style.display="none";
        adminGo.innerHTML='<span class="settings-item-left"><i class="fas fa-screwdriver-wrench" aria-hidden="true"></i><span>Admin</span></span>';
        adminGo.addEventListener("click",()=>{
          if(typeof transitionToPage==="function")transitionToPage("page-admin");
          if(typeof refreshAdminDashboard==="function")refreshAdminDashboard();
        });
        profile.querySelector(".grocerly-advanced-settings")?.appendChild(adminGo);
      }
      // Keep the display name synced after backend profile refresh.
      const original=window.refreshProfileCard;
      if(typeof original==="function")window.refreshProfileCard=function(){
        const result=original.apply(this,arguments);
        fillName();
        const permission=$("grocerly-ai-permission");
        if(permission){
          const key="grocerly_ai_features_" + (State.user?.email||"default");
          permission.checked=localStorage.getItem(key)!=="false";
        }
        return result;
      };
    }

    // EN/ES stays available on login and onboarding, without duplicating the app header.
    const authLanguage=document.createElement("div");
    authLanguage.id="grocerly-auth-language";
    authLanguage.className="grocerly-language-switch grocerly-auth-language";
    authLanguage.setAttribute("role","group");
    authLanguage.setAttribute("aria-label","Language");
    ["en","es"].forEach(language=>{
      const button=document.createElement("button");
      button.type="button";button.textContent=language.toUpperCase();
      button.setAttribute("lang",language);
      button.addEventListener("click",()=>{
        if(window.GrocerlyLanguage)window.GrocerlyLanguage.set(language);
        reflectLanguage();
      });
      button.dataset.lang=language;
      authLanguage.appendChild(button);
    });
    function reflectLanguage(){
      const selected=window.GrocerlyLanguage?.current()||"en";
      authLanguage.querySelectorAll("button").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.lang===selected)));
    }
    reflectLanguage();
    document.querySelector(".device-wrapper")?.appendChild(authLanguage);
    const appLanguage=$("grocerly-language-switch");
    appLanguage?.addEventListener("click",()=>setTimeout(reflectLanguage,0));

    // The primary Add button matches the reference, while opening the receipt camera.
    const addTrigger=$("btn-inventory-add-trigger");
    if(addTrigger){
      addTrigger.innerHTML='<i class="fas fa-plus" aria-hidden="true"></i> Add';
      addTrigger.setAttribute("aria-label","Add groceries by scanning a receipt");
    }
    const manualFromCamera=$("btn-camera-manual-add");
    if(manualFromCamera)manualFromCamera.addEventListener("click",()=>{
      $("btn-camera-close")?.click();
      inventory?.querySelector(".grocerly-manual-add")?.click();
    });
    const productFromCamera=$("btn-camera-product-photo");
    const productInput=$("grocerly-product-photo");
    // Keep the file picker outside the visually hidden extra-options container.
    if(productInput) $("modal-camera")?.appendChild(productInput);
    if(productFromCamera)productFromCamera.addEventListener("click",()=>{
      $("btn-camera-close")?.click();
      productInput?.click();
    });

    // The Lifespan pencil edits days between shopping trips, while the existing
    // desiredStorageWeeks field remains the persisted source of truth.
    const lifespanButton=$("btn-edit-lifespan-trigger");
    const lifespanModal=$("modal-edit-lifespan");
    const lifespanForm=$("form-edit-lifespan");
    const lifespanInput=$("edit-lifespan-days");
    const lifespanClose=$("btn-lifespan-close");
    function closeLifespan(){
      lifespanModal?.classList.remove("active");
      lifespanButton?.focus();
    }
    if(lifespanButton && lifespanModal && lifespanForm && lifespanInput){
      lifespanButton.addEventListener("click",()=>{
        const current=Number(State?.user?.desiredStorageWeeks);
        lifespanInput.value=String(Number.isFinite(current)&&current>0?Math.round(current*7):14);
        lifespanModal.classList.add("active");
        lifespanInput.focus();
        lifespanInput.select();
      });
      lifespanClose?.addEventListener("click",closeLifespan);
      lifespanModal.addEventListener("click",event=>{
        if(event.target===lifespanModal)closeLifespan();
      });
      lifespanModal.addEventListener("keydown",event=>{
        if(event.key==="Escape"){
          event.preventDefault();
          closeLifespan();
        }
      });
      lifespanForm.addEventListener("submit",event=>{
        event.preventDefault();
        const days=Number(lifespanInput.value);
        if(!Number.isInteger(days)||days<1||days>365){
          lifespanInput.setCustomValidity("Choose a whole number from 1 to 365.");
          lifespanInput.reportValidity();
          return;
        }
        lifespanInput.setCustomValidity("");
        if(!State?.user)return;
        State.user.desiredStorageWeeks=days/7;
        if(typeof saveStateToStorage==="function")saveStateToStorage();
        if(typeof refreshDashboard==="function")refreshDashboard();
        closeLifespan();
      });
      lifespanInput.addEventListener("input",()=>lifespanInput.setCustomValidity(""));
    }

    // The existing image cropper owns saving/syncing. Make its file picker
    // accessible from keyboard and ensure the thumbnail refreshes after crop.
    const avatarTrigger=$("profile-avatar-trigger");
    const avatarFile=$("profile-card-upload");
    const avatarImage=$("profile-card-img");
    if(avatarTrigger && avatarFile){
      avatarTrigger.addEventListener("keydown",event=>{
        if(event.key==="Enter"||event.key===" "){
          event.preventDefault();
          avatarFile.click();
        }
      });
      avatarFile.addEventListener("change",()=>{
        // Resetting after selection allows reusing the same file for a retry.
        setTimeout(()=>{avatarFile.value="";},0);
      });
    }
    if(avatarImage){
      avatarImage.addEventListener("error",()=>{
        // Fail gracefully for broken remote image references, without modifying
        // the saved user data. A new upload can replace the unavailable image.
        avatarImage.style.background="var(--primary-green-light)";
      });
    }

    // Keep the user-visible main tab highlighted after returning from secondary screens.
    document.querySelectorAll("#app-bottom-nav .nav-item").forEach(a=>{
      a.addEventListener("click",()=>{document.querySelectorAll("#app-bottom-nav .nav-item").forEach(item=>item.classList.toggle("active",item===a));});
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize);
  else initialize();
})();
