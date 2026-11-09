/* Grocerly English / Español user-interface translations.
 * Offline, local strings: no user grocery data is transmitted to a translator.
 * Preserve original text and input values so toggling never changes saved data.
 */
(function () {
  "use strict";
  const rows = [
    ["Buy Smarter. Waste Less. Eat Better.","Compra mejor. Desperdicia menos. Come bien."],
    ["Simply better groceries.","Compras más sencillas."],
    ["Email Address","Correo electrónico"],
    ["Password","Contraseña"],
    ["Confirm Password","Confirmar contraseña"],
    ["Keep me signed in","Mantener mi sesión iniciada"],
    ["Sign In","Iniciar sesión"],
    ["Sign Up","Crear cuenta"],
    ["Forgot Password?","¿Olvidaste tu contraseña?"],
    ["or continue with","o continúa con"],
    ["Join Grocerly","Únete a Grocerly"],
    ["Your Full Name","Nombre completo"],
    ["Minimum 6 characters","Mínimo 6 caracteres"],
    ["Confirm your password","Confirma tu contraseña"],
    ["Register","Registrarse"],
    ["Back to Login","Volver al inicio de sesión"],
    ["Profile Setup","Configurar perfil"],
    ["Tell us about yourself to tailor Grocerly to your kitchen.","Cuéntanos un poco sobre ti para adaptar Grocerly a tu hogar."],
    ["Upload Profile Picture","Subir foto de perfil"],
    ["Household Size (People)","Personas en casa"],
    ["Location (Optional)","Ubicación (opcional)"],
    ["Age (Optional)","Edad (opcional)"],
    ["Continue","Continuar"],
    ["What are your goals?","¿Cuáles son tus objetivos?"],
    ["Select all that apply. We will customize your experience based on your choices.","Selecciona lo que más te interese."],
    ["Next","Siguiente"],
    ["Back","Volver"],
    ["Congratulations!","¡Felicidades!"],
    ["Your profile and grocery goals have been created.","Tu perfil y tus objetivos están listos."],
    ["Let's Get Started","Empezar"],
    ["Today","Hoy"],
    ["Home","Inicio"],
    ["My Plan","Mi plan"],
    ["Groceries","Compras"],
    ["My Groceries","Mis compras"],
    ["More","Más"],
    ["Scan receipt","Escanear recibo"],
    ["Scan Receipt","Escanear recibo"],
    ["Insights","Estadísticas"],
    ["Settings","Configuración"],
    ["Profile","Perfil"],
    ["Admin","Administración"],
    ["Quick actions","Acciones rápidas"],
    ["What would you like to do?","¿Qué te gustaría hacer?"],
    ["Plan meals","Planificar comidas"],
    ["My groceries","Mis compras"],
    ["Budget","Presupuesto"],
    ["Savings","Ahorro"],
    ["Lifespan","Duración"],
    ["Waste","Desperdicio"],
    ["Projected this month","Estimado para este mes"],
    ["Average store loop","Promedio entre compras"],
    ["Current Grocery List","Lo que tienes en casa"],
    ["Meals","Comidas"],
    ["Ingredient","Ingrediente"],
    ["Ingredients","Ingredientes"],
    ["Qty","Cant."],
    ["Quantity","Cantidad"],
    ["Storage","Almacenamiento"],
    ["Status","Estado"],
    ["Actionable Needs","Requiere atención"],
    ["Your Active Focus","Tus prioridades"],
    ["Weekly Meal Planner","Plan semanal de comidas"],
    ["Weekly meal calendar","Calendario semanal"],
    ["Previous","Anterior"],
    ["This Week","Esta semana"],
    ["Reset","Restablecer"],
    ["Scan a receipt","Escanear un recibo"],
    ["Add groceries without typing every item.","Añade compras sin escribir cada producto."],
    ["Import Bill","Importar factura"],
    ["Sample receipt options","Opciones de recibo de ejemplo"],
    ["Choose a sample store:","Elige una tienda de ejemplo:"],
    ["Other","Otra"],
    ["ENTER CUSTOM STORE NAME","NOMBRE DE LA TIENDA"],
    ["Scan Receipt Camera / Upload","Tomar foto o subir recibo"],
    ["Tap to open camera scanner or choose from photo library","Usa la cámara o selecciona una foto."],
    ["OPEN SCANNER","ABRIR CÁMARA"],
    ["Total","Total"],
    ["Receipt Total","Total del recibo"],
    ["Cancel","Cancelar"],
    ["Add to My Groceries","Añadir a mis compras"],
    ["Import digital receipt invoice","Importar factura digital"],
    ["Drag and drop PDF, PNG or Forward your receipt emails","Sube un PDF o una imagen del recibo."],
    ["UPLOAD PDF / IMAGE FILE","SUBIR ARCHIVO"],
    ["Email Integration Key:","Dirección para recibos:"],
    ["COPY","COPIAR"],
    ["Receipt Records & Folders","Historial de recibos"],
    ["Browse your purchases history organized into folders.","Consulta tus compras anteriores."],
    ["Digital Shopping Lists","Listas de compras"],
    ["Saved store checklist templates for re-shopping & tracking.","Listas guardadas para tus próximas compras."],
    ["Find meals using what you already have.","Prepara comidas con lo que ya tienes."],
    ["Meal Builder","Planificar comidas"],
    ["Ideas","Ideas"],
    ["Add","Añadir"],
    ["Create Recipe","Crear receta"],
    ["Recipe Name","Nombre de receta"],
    ["Short Description","Descripción breve"],
    ["Ingredients List","Ingredientes"],
    ["Add Ingredient Row","Añadir ingrediente"],
    ["Cooking Instructions","Instrucciones"],
    ["Save Recipe","Guardar receta"],
    ["Search recipe name...","Buscar recetas..."],
    ["All","Todos"],
    ["Breakfast","Desayuno"],
    ["Lunch","Almuerzo"],
    ["Dinner","Cena"],
    ["AI Meal Ideas Generator","Ideas de comidas"],
    ["Got one item?","¿Tienes un producto?"],
    ["Take a picture of its label or shelf tag. We'll try to fill in the details for you.","Fotografía la etiqueta o el precio. Intentaremos completar los datos."],
    ["Photo of item","Foto de producto"],
    ["Add manually","Añadir manualmente"],
    ["Scan or upload a grocery receipt","Escanear o subir un recibo"],
    ["Export","Exportar"],
    ["Done","Listo"],
    ["Search storage items...","Buscar productos..."],
    ["All Storage","Todos"],
    ["Fridge","Refrigerador"],
    ["Freezer","Congelador"],
    ["Pantry","Despensa"],
    ["By Category","Por categoría"],
    ["All Categories","Todas las categorías"],
    ["Dairy & Eggs","Lácteos y huevos"],
    ["Meat & Poultry","Carnes y aves"],
    ["Produce","Frutas y verduras"],
    ["Bakery & Grain","Pan y cereales"],
    ["Frozen","Congelados"],
    ["Snacks","Bocadillos"],
    ["Drinks","Bebidas"],
    ["Condiments","Condimentos"],
    ["Spices/Herbs","Especias y hierbas"],
    ["By Store","Por tienda"],
    ["All Stores","Todas las tiendas"],
    ["Analytics","Estadísticas"],
    ["Track your budget, savings, nutrition, and food waste.","Consulta tus gastos, alimentos y desperdicios."],
    ["Total Spend","Gasto total"],
    ["Past 30 Days","Últimos 30 días"],
    ["Waste Index","Índice de desperdicio"],
    ["Target: <5%","Meta: menos del 5 %"],
    ["Spending vs Budget","Gastos y presupuesto"],
    ["WEEKLY","SEMANAL"],
    ["MONTHLY","MENSUAL"],
    ["Spending Trends","Tendencias de gastos"],
    ["Food Use Ratio","Uso de alimentos"],
    ["WASTE VS USE","DESPERDICIO Y USO"],
    ["Nutrition Goal Met (%)","Objetivo nutricional (%)"],
    ["DAILY MACROS","NUTRIENTES DIARIOS"],
    ["Ingredient Lifespan Timeline","Duración de los alimentos"],
    ["HISTORY","HISTORIAL"],
    ["My Profile","Mi perfil"],
    ["Manage goals, sharing, and configuration parameters.","Administra tus preferencias y opciones."],
    ["APP OPTIONS","OPCIONES"],
    ["Upgrade to Premium","Mejorar a Premium"],
    ["Dark Theme Override","Tema oscuro"],
    ["Preferred Currency","Moneda preferida"],
    ["Admin Mode","Modo administrador"],
    ["Family Grocery Sharing","Compras compartidas"],
    ["Active Members","Miembros activos"],
    ["Re-adjust Grocery Goals","Cambiar mis objetivos"],
    ["Predictive AI Reminders","Recordatorios inteligentes"],
    ["Submit App Feedback","Enviar comentarios"],
    ["Sign Out","Cerrar sesión"],
    ["Store Shopping List","Lista de compras"],
    ["Add new item (e.g. Eggs)","Añadir producto (p. ej., huevos)"],
    ["Print List","Imprimir lista"],
    ["Done Shopping","Finalizar compra"],
    ["Welcome to Grocerly","Te damos la bienvenida a Grocerly"],
    ["Buy Smarter","Compra mejor"],
    ["Waste Less","Desperdicia menos"],
    ["Eat Better","Come mejor"],
    ["Next Tip","Siguiente consejo"],
    ["Skip Tutorial","Omitir guía"],
    ["Split Storage","Dividir producto"],
    ["Original Quantity:","Cantidad original:"],
    ["LOCATION","UBICACIÓN"],
    ["Log Item Disposition","Registrar uso del producto"],
    ["Fully Used / Eaten","Usado o consumido"],
    ["Spoiled (Food Waste)","Se echó a perder"],
    ["Donated","Donado"],
    ["Thrown Away","Desechado"],
    ["App Notifications","Notificaciones"],
    ["Family Sharing Config","Compartir en familia"],
    ["Invite Member via Email","Invitar por correo"],
    ["Invite","Invitar"],
    ["What Can I Cook?","¿Qué puedo cocinar?"],
    ["Suggestions","Sugerencias"],
    ["Preservation","Conservación"],
    ["Forecast","Previsión"],
    ["Edit Grocery Budget","Editar presupuesto"],
    ["Budget Period","Periodo del presupuesto"],
    ["Weekly","Semanal"],
    ["Biweekly","Quincenal"],
    ["Monthly","Mensual"],
    ["Budget Amount ($)","Presupuesto ($)"],
    ["Save Changes","Guardar cambios"],
    ["Camera Receipt Scanner","Cámara para recibos"],
    ["Align receipt to detect text automatically","Encuadra el recibo para leer el texto."],
    ["ALIGN RECEIPT HERE","ENCUADRA EL RECIBO"],
    ["Take Photo","Tomar foto"],
    ["Gallery","Galería"],
    ["Retake","Repetir"],
    ["Use This Photo","Usar esta foto"],
    ["Go Premium","Pasar a Premium"],
    ["Choose an Account","Elegir cuenta"],
    ["Or use another email","O usa otro correo"],
    ["Adjust Profile Photo","Ajustar foto de perfil"],
    ["Save Photo","Guardar foto"],
    ["Add Grocery","Añadir producto"],
    ["Edit Grocery","Editar producto"],
    ["Ingredient Name","Nombre del producto"],
    ["Category","Categoría"],
    ["Unit","Unidad"],
    ["Price ($)","Precio ($)"],
    ["Purchase Date","Fecha de compra"],
    ["Exp. Date","Fecha de vencimiento"],
    ["Storage Location","Dónde se guarda"],
    ["Store Purchased From","Tienda"],
    ["Manage Stores","Administrar tiendas"],
    ["Notes / Details","Notas"],
    ["Add to Groceries","Guardar producto"],
    ["Select the store you just finished shopping at to see your total:","Elige la tienda para ver el total:"],
    ["Calculate Total","Calcular total"],
    ["Manage Custom Stores","Administrar tiendas"],
    ["Add Custom Store","Añadir tienda"],
    ["Your Message","Tu mensaje"],
    ["Send Feedback","Enviar comentarios"],
    ["Generate Meal Idea","Sugerir comida"],
    ["Item name","Nombre del producto"],
    ["Item price","Precio del producto"],
    ["Remove item","Quitar producto"],
    ["Recognized","Identificado"],
    ["Please check this item","Revisa este producto"],
    ["Reading the label…","Leyendo la etiqueta…"],
    ["Please choose a photo.","Selecciona una foto."],
    ["We couldn't read a product name. Try a clearer photo or add it manually.","No pudimos leer el nombre. Prueba una foto más clara o añádelo manualmente."],
    ["We found possible label text. Check the name and enter the price before saving.","Encontramos texto en la etiqueta. Revisa el nombre y escribe el precio antes de guardar."],
    ["We found possible label text and a price. Please check both before saving.","Encontramos un posible nombre y precio. Comprueba ambos antes de guardar."],
    ["Photo suggestions can be wrong. Confirm the product, quantity and shelf price before adding.","La foto puede contener errores. Revisa el producto, la cantidad y el precio antes de guardar."],
    ["We couldn't read that photo. Try again or use Add manually.","No pudimos leer la foto. Inténtalo de nuevo o añade el producto manualmente."],
    ["Language","Idioma"],
    ["Main navigation","Navegación principal"],
    ["Quick actions","Acciones rápidas"],
    ["Choose a product label photo","Elegir foto de la etiqueta"],
    ["No spending data logged yet. Add your first grocery trip!","Todavía no hay gastos registrados. ¡Añade tu primera compra!"]
  ];
  const es = new Map(rows);
  const textRecords = new WeakMap();
  const attrRecords = new WeakMap();
  let locale = "en";
  let observer;
  let scheduled = false;
  let translating = false;

  function localized(source) {
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(source);
    if (!match) return source;
    const value = match[2];
    let target = es.get(value);
    if (target === undefined) {
      let m;
      if ((m = /^Welcome,\s*(.+)$/.exec(value))) target = "Hola, " + m[1];
      else if ((m = /^(\d+)\s+ingredients? in storage$/.exec(value))) target = m[1] + " ingredientes en casa";
      else if ((m = /^(\d+)\s+items?$/.exec(value))) target = m[1] + " productos";
      else if ((m = /^(\d+)\s+Ideas?$/.exec(value))) target = m[1] + " ideas";
      else if ((m = /^Spend:\s*(.+)\s+of\s+(.+)$/.exec(value))) target = "Gastado: " + m[1] + " de " + m[2];
      else if ((m = /^(\d+)\s+People$/.exec(value))) target = m[1] + " personas";
    }
    return target === undefined ? source : match[1] + target + match[3];
  }

  function shouldSkip(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    if (parent.closest("script,style,noscript,textarea,code,pre,svg,.grocerly-language-switch,[data-no-translate]")) return true;
    return false;
  }

  function updateText(node) {
    if (shouldSkip(node) || !node.nodeValue.trim()) return;
    let record = textRecords.get(node);
    if (!record || record.rendered !== node.nodeValue) record = { source: node.nodeValue, rendered: node.nodeValue };
    const next = locale === "es" ? localized(record.source) : record.source;
    if (node.nodeValue !== next) node.nodeValue = next;
    record.rendered = next;
    textRecords.set(node, record);
  }

  const attrs = ["placeholder", "title", "aria-label"];
  function updateAttrs(element) {
    if (element.closest(".grocerly-language-switch,[data-no-translate]")) return;
    let records = attrRecords.get(element);
    if (!records) records = {};
    for (const attr of attrs) {
      const current = element.getAttribute(attr);
      if (current === null) continue;
      let record = records[attr];
      if (!record || record.rendered !== current) record = { source: current, rendered: current };
      const next = locale === "es" ? localized(record.source) : record.source;
      if (next !== current) element.setAttribute(attr, next);
      record.rendered = next;
      records[attr] = record;
    }
    attrRecords.set(element, records);
  }

  function translateAll() {
    if (translating || !document.body) return;
    translating = true;
    if (observer) observer.disconnect();
    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) updateText(walker.currentNode);
      document.querySelectorAll("[placeholder],[title],[aria-label]").forEach(updateAttrs);
      document.documentElement.lang = locale;
      document.title = locale === "es" ? "Grocerly — Tus compras más sencillas" : "Grocerly — Buy Smarter. Waste Less. Eat Better.";
      const toggle = document.getElementById("grocerly-language-switch");
      if (toggle) {
        toggle.setAttribute("aria-label", locale === "es" ? "Idioma" : "Language");
        toggle.querySelectorAll("[data-lang]").forEach(button => {
          button.setAttribute("aria-pressed", String(button.dataset.lang === locale));
          button.setAttribute("title", button.dataset.lang === "es" ? "Español" : "English");
        });
      }
    } finally {
      translating = false;
      if (observer) observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    }
  }

  function setLanguage(next) {
    locale = next === "es" ? "es" : "en";
    try { localStorage.setItem("grocerly_language", locale); } catch (_) {}
    translateAll();
  }

  function init() {
    const toggle = document.getElementById("grocerly-language-switch");
    if (!toggle) return;
    toggle.querySelectorAll("[data-lang]").forEach(button => {
      button.addEventListener("click", () => setLanguage(button.dataset.lang));
    });
    observer = new MutationObserver(() => {
      if (scheduled || translating || locale !== "es") return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; translateAll(); });
    });
    let stored = "en";
    try { stored = localStorage.getItem("grocerly_language") || "en"; } catch (_) {}
    setLanguage(stored);
    window.GrocerlyLanguage = { set: setLanguage, current: () => locale };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
