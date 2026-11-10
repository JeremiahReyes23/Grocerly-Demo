/* Fixed Grocerly viewport: group settings and receipt content into self-scrolling
 * panels so the main page does not scroll. Keeps all existing controls and IDs. */
(function(){
  "use strict";
  function init(){
    const profile=document.getElementById("page-profile");
    if(profile && !profile.querySelector(".grocerly-profile-scroll")){
      const panel=document.createElement("div");
      panel.className="grocerly-profile-scroll";
      panel.setAttribute("role","region");
      panel.setAttribute("aria-label","Account settings");
      const keep=node=>node.classList?.contains("btn-group") && node.querySelector("#btn-logout");
      const nodes=[...profile.children].filter(node=>!keep(node));
      const anchor=nodes[0];
      if(anchor){
        profile.insertBefore(panel,anchor);
        nodes.forEach(node=>panel.appendChild(node));
        // Keep avatar and title in a single responsive heading; no floating
        // absolute positioning that overlaps controls or shifts with language.
        const heading=panel.querySelector(":scope > h1");
        const subtitle=panel.querySelector(":scope > .grocerly-profile-intro");
        const avatar=panel.querySelector(":scope > .profile-card");
        if(heading && subtitle && avatar){
          const identity=document.createElement("div");
          identity.className="grocerly-profile-identity";
          panel.insertBefore(identity,heading);
          identity.append(heading,subtitle,avatar);
        }
        // The original decorative spacer wastes precious height on mobile.
        const spacer=[...panel.children].find(node=>
          node.tagName==="DIV" && /height:\s*30px/.test(node.getAttribute("style")||""));
        if(spacer)spacer.remove();
      }
    }

    const receipt=document.getElementById("page-groceries");
    if(receipt && !receipt.querySelector(".grocerly-receipt-task-scroll")){
      const panel=document.createElement("div");
      panel.className="grocerly-receipt-task-scroll";
      panel.setAttribute("role","region");
      panel.setAttribute("aria-label","Receipt details");
      const title=receipt.querySelector(":scope > h1");
      const subtitle=receipt.querySelector(":scope > p");
      const children=[...receipt.children].filter(node=>node!==title&&node!==subtitle);
      if(children.length){
        receipt.insertBefore(panel,children[0]);
        children.forEach(node=>panel.appendChild(node));
      }
    }

    // Itemized receipt reviews are paginated instead of scrolling or cropping.
    // Input fields remain mounted on every page, so saving imports every edited
    // item (not just the visible page), and delete still works normally.
    const review=document.getElementById("receipt-review-container");
    const reviewItems=document.getElementById("review-receipt-items-list");
    if(review&&reviewItems&&!document.getElementById("receipt-review-pagination")){
      const controls=document.createElement("div");
      controls.id="receipt-review-pagination";
      controls.setAttribute("aria-label","Receipt items pages");
      const prev=document.createElement("button");
      prev.type="button";prev.id="receipt-review-prev";
      const status=document.createElement("span");
      status.id="receipt-review-page-status";
      status.setAttribute("role","status");
      status.setAttribute("aria-live","polite");
      const next=document.createElement("button");
      next.type="button";next.id="receipt-review-next";
      controls.append(prev,status,next);
      reviewItems.after(controls);
      let currentPage=0;
      let lastRows=[];
      let renderRequested=false;
      function renderPages(){
        renderRequested=false;
        const rows=[...reviewItems.children].filter(node=>node.classList.contains("review-item-row"));
        const isOpen=review.style.display!=="none";
        const es=document.documentElement.lang.toLowerCase().startsWith("es");
        prev.textContent=es?"Anterior":"Previous";
        next.textContent=es?"Siguiente":"Next";
        if(!isOpen||rows.length===0){
          controls.hidden=true;
          return;
        }
        if(rows.length!==lastRows.length||rows.some((row,i)=>row!==lastRows[i])) currentPage=0;
        lastRows=rows;
        // Measure a representative row. The list is a flex child with an
        // actual available height after the scanner card is hidden.
        rows.forEach((row,i)=>{row.hidden=i>0;});
        const first=rows[0];
        const height=Math.max(55,first.getBoundingClientRect().height||72);
        const gap=parseFloat(getComputedStyle(reviewItems).gap)||5;
        const area=Math.max(0,reviewItems.clientHeight);
        const pageSize=Math.max(1,Math.min(8,Math.floor((area+gap)/(height+gap))));
        const pages=Math.max(1,Math.ceil(rows.length/pageSize));
        currentPage=Math.max(0,Math.min(currentPage,pages-1));
        rows.forEach((row,i)=>{row.hidden=Math.floor(i/pageSize)!==currentPage;});
        status.textContent=es
          ? "Página "+(currentPage+1)+" de "+pages
          : "Page "+(currentPage+1)+" of "+pages;
        prev.disabled=currentPage===0;
        next.disabled=currentPage>=pages-1;
        controls.hidden=pages===1;
      }
      function schedulePages(){
        if(renderRequested)return;
        renderRequested=true;
        requestAnimationFrame(renderPages);
      }
      prev.addEventListener("click",()=>{currentPage--;schedulePages();});
      next.addEventListener("click",()=>{currentPage++;schedulePages();});
      new MutationObserver(schedulePages).observe(reviewItems,{childList:true});
      new MutationObserver(schedulePages).observe(review,{attributes:true,attributeFilter:["style"]});
      const observer=new ResizeObserver(schedulePages);
      observer.observe(reviewItems);
      window.addEventListener("resize",schedulePages);
      document.getElementById("grocerly-language-switch")?.addEventListener("click",schedulePages);
      schedulePages();
    }

    // Existing onclick code toggles the dropdown, but the entire Home screen
    // must remain stationary. The list stays expanded and scrollable inside.
    const section=document.getElementById("dash-grocery-list-dropdown");
    if(section){
      section.classList.add("active");
      const heading=section.querySelector(".dropdown-header");
      if(heading){
        heading.addEventListener("click",e=>{
          if(e.target.closest("#btn-dash-go-meals"))return;
          e.stopImmediatePropagation();
          section.classList.add("active");
        },true);
      }
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
})();
