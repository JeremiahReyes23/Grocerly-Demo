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
      const keep=node=>node.classList?.contains("profile-card") ||
        (node.classList?.contains("btn-group") && node.querySelector("#btn-logout"));
      const nodes=[...profile.children].filter(node=>!keep(node));
      const anchor=nodes[0];
      if(anchor){
        profile.insertBefore(panel,anchor);
        nodes.forEach(node=>panel.appendChild(node));
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
