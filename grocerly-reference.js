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
        const ai=$("grocerly-ai-shortcut");
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
      const ai=$("grocerly-ai-shortcut");
      if(ai)ai.addEventListener("click",()=>$("btn-dashboard-ai")?.click());
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
        const result=original.apply(this,arguments);fillName();return result;
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

    // Keep the user-visible main tab highlighted after returning from secondary screens.
    document.querySelectorAll("#app-bottom-nav .nav-item").forEach(a=>{
      a.addEventListener("click",()=>{document.querySelectorAll("#app-bottom-nav .nav-item").forEach(item=>item.classList.toggle("active",item===a));});
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize);
  else initialize();
})();
