import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";

// ─── RAW MATERIALS DATABASE ───────────────────────────────────────────────────
const RAW_MATERIALS = [
  { id:"SP001", name:"Viande Haché",         unit:"kg",         usable:100, unitPrice:32.00,  pricePerG:0.032 },
  { id:"SP002", name:"Thon",                 unit:"2 kg",       usable:75,  unitPrice:45.00,  pricePerG:0.030 },
  { id:"SP003", name:"Escalope",             unit:"kg",         usable:95,  unitPrice:18.00,  pricePerG:0.01895 },
  { id:"SP004", name:"Escalope Panné",       unit:"kg",         usable:100, unitPrice:22.00,  pricePerG:0.022 },
  { id:"SP005", name:"Cordon Bleu",          unit:"kg",         usable:100, unitPrice:25.00,  pricePerG:0.025 },
  { id:"SP006", name:"Chawarma Poulet",      unit:"kg",         usable:100, unitPrice:22.00,  pricePerG:0.022 },
  { id:"SP007", name:"Chawarma Viande",      unit:"kg",         usable:100, unitPrice:45.00,  pricePerG:0.045 },
  { id:"SP008", name:"Kabeb Poulet",         unit:"kg",         usable:100, unitPrice:35.00,  pricePerG:0.035 },
  { id:"SP009", name:"Kabeb Viande",         unit:"kg",         usable:100, unitPrice:38.00,  pricePerG:0.038 },
  { id:"SP010", name:"Viande Agneau",        unit:"kg",         usable:100, unitPrice:60.00,  pricePerG:0.060 },
  { id:"SP011", name:"Viande Boeuf",         unit:"kg",         usable:100, unitPrice:48.00,  pricePerG:0.048 },
  { id:"SP012", name:"Foie",                 unit:"kg",         usable:100, unitPrice:48.00,  pricePerG:0.048 },
  { id:"SP013", name:"Merguez",              unit:"kg",         usable:100, unitPrice:25.00,  pricePerG:0.025 },
  { id:"SP014", name:"Poulet complet",       unit:"1 Pcs",      usable:100, unitPrice:13.00,  pricePerG:13.00,  isPcs:true },
  { id:"SP015", name:"1/4 Poulet",           unit:"1 Pcs",      usable:100, unitPrice:4.00,   pricePerG:4.00,   isPcs:true },
  { id:"SP016", name:"1/2 Poulet",           unit:"1 Pcs",      usable:100, unitPrice:7.50,   pricePerG:7.50,   isPcs:true },
  { id:"SP017", name:"Jambon",               unit:"kg",         usable:100, unitPrice:30.00,  pricePerG:0.030 },
  { id:"SP018", name:"Jambon Fumé",          unit:"kg",         usable:100, unitPrice:35.00,  pricePerG:0.035 },
  { id:"SP019", name:"Salami",               unit:"kg",         usable:100, unitPrice:18.00,  pricePerG:0.018 },
  { id:"SP020", name:"Blanc Poulet Fumé",    unit:"kg",         usable:100, unitPrice:37.00,  pricePerG:0.037 },
  { id:"SP021", name:"Bresaola",             unit:"kg",         usable:100, unitPrice:80.00,  pricePerG:0.080 },
  { id:"SP022", name:"Bacon",                unit:"kg",         usable:100, unitPrice:75.00,  pricePerG:0.075 },
  { id:"SP023", name:"Fruit de mer mélange", unit:"kg",         usable:100, unitPrice:45.00,  pricePerG:0.045 },
  { id:"SP024", name:"Seiche",               unit:"kg",         usable:75,  unitPrice:28.00,  pricePerG:0.03733 },
  { id:"SP025", name:"Calamar",              unit:"kg",         usable:75,  unitPrice:45.00,  pricePerG:0.060 },
  { id:"SP026", name:"Poulpe",               unit:"kg",         usable:80,  unitPrice:38.00,  pricePerG:0.04750 },
  { id:"SP027", name:"Moule",                unit:"kg",         usable:95,  unitPrice:25.00,  pricePerG:0.02632 },
  { id:"SP028", name:"Chevrette",            unit:"kg",         usable:85,  unitPrice:35.00,  pricePerG:0.04118 },
  { id:"SP029", name:"Crevette",             unit:"kg",         usable:95,  unitPrice:80.00,  pricePerG:0.08421 },
  { id:"SP030", name:"Oeuf",                 unit:"1 Pcs",      usable:100, unitPrice:0.40,   pricePerG:0.40,   isPcs:true },
  { id:"SP031", name:"Gruyère",              unit:"kg",         usable:100, unitPrice:53.00,  pricePerG:0.053 },
  { id:"SP032", name:"Mozzarella",           unit:"kg",         usable:100, unitPrice:25.00,  pricePerG:0.025 },
  { id:"SP033", name:"Cheddar",              unit:"kg",         usable:100, unitPrice:28.00,  pricePerG:0.028 },
  { id:"SP034", name:"Fromage Bleu",         unit:"kg",         usable:97,  unitPrice:64.00,  pricePerG:0.06598 },
  { id:"SP035", name:"Parmesan",             unit:"kg",         usable:100, unitPrice:105.00, pricePerG:0.105 },
  { id:"SP036", name:"Burrata",              unit:"1 Pcs",      usable:100, unitPrice:8.00,   pricePerG:8.00,   isPcs:true },
  { id:"SP037", name:"Sauce Tomate",         unit:"5 kg",       usable:100, unitPrice:20.00,  pricePerG:0.004 },
  { id:"SP038", name:"Harissa",              unit:"2 kg",       usable:95,  unitPrice:12.00,  pricePerG:0.00632 },
  { id:"SP039", name:"Salade Mechouia",      unit:"5 kg",       usable:95,  unitPrice:20.00,  pricePerG:0.00421 },
  { id:"SP040", name:"Mayonnaise",           unit:"5 kg",       usable:95,  unitPrice:22.00,  pricePerG:0.00463 },
  { id:"SP041", name:"Sauce Algérienne",     unit:"3 kg",       usable:95,  unitPrice:18.00,  pricePerG:0.00632 },
  { id:"SP042", name:"BBQ",                  unit:"5 kg",       usable:95,  unitPrice:25.00,  pricePerG:0.00526 },
  { id:"SP043", name:"Ketchup",              unit:"5 kg",       usable:95,  unitPrice:25.00,  pricePerG:0.00526 },
  { id:"SP044", name:"Sauce Burger",         unit:"3 kg",       usable:95,  unitPrice:21.00,  pricePerG:0.00737 },
  { id:"SP045", name:"Sauce Cheddar",        unit:"1 kg",       usable:95,  unitPrice:19.00,  pricePerG:0.020 },
  { id:"SP046", name:"Sauce Pesto",          unit:"1 kg",       usable:95,  unitPrice:15.00,  pricePerG:0.01579 },
  { id:"SP047", name:"Tomate",               unit:"kg",         usable:90,  unitPrice:1.50,   pricePerG:0.00167 },
  { id:"SP048", name:"Laitue",               unit:"1 Pcs 700g", usable:95,  unitPrice:1.20,   pricePerG:0.00180 },
  { id:"SP049", name:"Piment vert doux",     unit:"kg",         usable:98,  unitPrice:3.00,   pricePerG:0.00306 },
  { id:"SP050", name:"Pomme de terre",       unit:"kg",         usable:95,  unitPrice:1.50,   pricePerG:0.00158 },
  { id:"SP051", name:"Carotte",              unit:"kg",         usable:78,  unitPrice:1.50,   pricePerG:0.00192 },
  { id:"SP052", name:"Courgette",            unit:"kg",         usable:85,  unitPrice:2.50,   pricePerG:0.00294 },
  { id:"SP053", name:"Concombre",            unit:"kg",         usable:95,  unitPrice:3.00,   pricePerG:0.00316 },
  { id:"SP054", name:"Aubergine",            unit:"kg",         usable:90,  unitPrice:2.50,   pricePerG:0.00278 },
  { id:"SP055", name:"Oignon",               unit:"kg",         usable:85,  unitPrice:2.00,   pricePerG:0.00235 },
  { id:"SP056", name:"Frite fraîche",        unit:"kg",         usable:100, unitPrice:4.50,   pricePerG:0.0045 },
  { id:"SP057", name:"Frite surgelée",       unit:"kg",         usable:100, unitPrice:6.50,   pricePerG:0.0065 },
  { id:"SP058", name:"Pain Burger",          unit:"10 pcs",     usable:90,  unitPrice:6.00,   pricePerG:0.6667, isPcs:true },
  { id:"SP059", name:"Pain Libanais",        unit:"10 pcs",     usable:85,  unitPrice:5.50,   pricePerG:0.6471, isPcs:true },
  { id:"SP060", name:"Pain Tacos",           unit:"10 pcs",     usable:90,  unitPrice:7.00,   pricePerG:0.7778, isPcs:true },
  { id:"SP070", name:"Boîte Burger",         unit:"1 Pcs",      usable:100, unitPrice:0.40,   pricePerG:0.40,   isPcs:true },
  { id:"SP076", name:"Plateau micro 3 comp", unit:"1 Pcs",      usable:100, unitPrice:1.00,   pricePerG:1.00,   isPcs:true },
  { id:"SP077", name:"Barquette Alu",        unit:"1 Pcs",      usable:100, unitPrice:0.60,   pricePerG:0.60,   isPcs:true },
  { id:"SP079", name:"Couvert",              unit:"1 Pcs",      usable:100, unitPrice:0.15,   pricePerG:0.15,   isPcs:true },
  { id:"SP080", name:"Papier serviette",     unit:"50 Pcs",     usable:75,  unitPrice:1.80,   pricePerG:0.048,  isPcs:true },
  { id:"SP081", name:"Paille",               unit:"100 Pcs",    usable:90,  unitPrice:2.40,   pricePerG:0.0267, isPcs:true },
  { id:"SP082", name:"Sachet",               unit:"50 Pcs",     usable:85,  unitPrice:1.20,   pricePerG:0.02824,isPcs:true },
  { id:"SP083", name:"Pochette Sandwich",    unit:"50 Pcs",     usable:90,  unitPrice:3.50,   pricePerG:0.0778, isPcs:true },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"burger",    label:"Fast Food / Burgers",              defaultFC:35 },
  { id:"pizza",     label:"Pizza",                            defaultFC:28 },
  { id:"sandwich",  label:"Sandwicherie / Tabouna",           defaultFC:32 },
  { id:"grill",     label:"Poulet Rôti / Grillades",          defaultFC:32 },
  { id:"tunisian",  label:"Cuisine Tunisienne / Plats",       defaultFC:40 },
  { id:"pastry",    label:"Pâtisserie / Desserts",            defaultFC:25 },
  { id:"sushi",     label:"Sushi / Cuisine Asiatique",        defaultFC:38 },
  { id:"healthy",   label:"Healthy / Salades",                defaultFC:30 },
  { id:"seafood",   label:"Seafood / Poissons",               defaultFC:45 },
  { id:"cafe",      label:"Café / Boissons",                  defaultFC:20 },
  { id:"multi",     label:"Multi-catégorie",                  defaultFC:35 },
];

const CITIES = ["Tunis Centre-Ville","La Marsa","Les Berges du Lac","Sousse","Sfax","Nabeul","Bizerte","Monastir","Autre"];

// ─── DEMO RESTAURANT ──────────────────────────────────────────────────────────
const DEMO_RESTAURANT = {
  name: "Chez Karim — Multi Express",
  city: "Tunis Centre-Ville",
  category: "multi",
  portionControl: true,
  defaultFC: 35,
};

const DEMO_ITEMS = [
  { id:"d1", name:"Burger Classique",       category:"burger",    posPrice:"19.000", foodCostPct: (6.756/19*100).toFixed(1), realCost: 6.756 },
  { id:"d2", name:"Burger Crunchy",         category:"burger",    posPrice:"17.000", foodCostPct: (5.556/17*100).toFixed(1), realCost: 5.556 },
  { id:"d3", name:"Sandwich Thon Libanais", category:"sandwich",  posPrice:"16.000", foodCostPct: (5.144/16*100).toFixed(1), realCost: 5.144 },
  { id:"d4", name:"Pizza Margherita",       category:"pizza",     posPrice:"18.000", foodCostPct:"28.0" },
  { id:"d5", name:"Pizza Thon",             category:"pizza",     posPrice:"22.000", foodCostPct:"30.0" },
  { id:"d6", name:"1/2 Poulet + Frites",    category:"grill",     posPrice:"18.000", foodCostPct:"33.0" },
  { id:"d7", name:"Couscous Agneau",        category:"tunisian",  posPrice:"28.000", foodCostPct:"40.0" },
  { id:"d8", name:"Ojja Merguez",           category:"tunisian",  posPrice:"16.000", foodCostPct:"38.0" },
  { id:"d9", name:"Salade Niçoise",         category:"healthy",   posPrice:"14.000", foodCostPct:"30.0" },
  { id:"d10",name:"Fruits de Mer Grillés",  category:"seafood",   posPrice:"35.000", foodCostPct:"45.0" },
  { id:"d11",name:"Makroudh",               category:"pastry",    posPrice:"8.000",  foodCostPct:"25.0" },
  { id:"d12",name:"Café Latte",             category:"cafe",      posPrice:"6.000",  foodCostPct:"20.0" },
];

// ─── CALC ENGINE ──────────────────────────────────────────────────────────────
function calcItem(item, portionControl) {
  const pos = parseFloat(item.posPrice) || 0;
  const baseFc = parseFloat(item.foodCostPct) || 0;
  const fc = portionControl ? baseFc : baseFc + 5;
  const appPrice = pos * 1.10;
  const rawMaterial = pos * (fc / 100);
  const sparowCommission = appPrice * 0.3;
  const newFCAmount = rawMaterial + sparowCommission;
  const newFCPct = appPrice > 0 ? (newFCAmount / appPrice) * 100 : 0;
  const marginPct = 100 - newFCPct;
  return { appPrice, rawMaterial, sparowCommission, newFCAmount, newFCPct, marginPct, effectiveFc: fc };
}

function calcSummary(items, portionControl) {
  const valid = items.filter(i => i.name && i.posPrice);
  if (!valid.length) return null;
  const calculated = valid.map(i => ({ ...i, ...calcItem(i, portionControl) }));
  const avg = calculated.reduce((s, i) => s + i.newFCPct, 0) / calculated.length;
  const zones = {
    green:    calculated.filter(i => i.newFCPct < 60).length,
    amber:    calculated.filter(i => i.newFCPct >= 60 && i.newFCPct < 75).length,
    red:      calculated.filter(i => i.newFCPct >= 75 && i.newFCPct < 85).length,
    critical: calculated.filter(i => i.newFCPct >= 85).length,
  };
  const sorted = [...calculated].sort((a, b) => a.newFCPct - b.newFCPct);
  let viability = "Viable";
  if (avg >= 85) viability = "Critique";
  else if (avg >= 75) viability = "À Risque";
  else if (avg >= 60) viability = "Modéré";
  return { calculated, avg, zones, best: sorted.slice(0,3), worst: sorted.slice(-3).reverse(), viability };
}

function getRecommendations(summary) {
  if (!summary) return [];
  const recs = [];
  const { avg, worst, zones } = summary;
  if (avg < 60) {
    recs.push({ level:"green", fr:"✅ Restaurant très viable sur Sparow. Recommandé pour onboarding.", ar:"✅ مطعم مربح جداً على سبارو. موصى به للانضمام." });
  } else if (avg < 75) {
    recs.push({ level:"amber", fr:"⚠️ Viable mais marges serrées. Recommander optimisation des prix sur 3 articles.", ar:"⚠️ مقبول لكن الهوامش ضيقة. يُنصح بمراجعة أسعار 3 منتجات." });
  } else if (avg < 85) {
    recs.push({ level:"red", fr:"🔴 Risque élevé. Négocier prix ou réduire commission à 25%.", ar:"🔴 خطر مرتفع. التفاوض على الأسعار أو تخفيض العمولة إلى 25%." });
  } else {
    recs.push({ level:"critical", fr:"❌ Non viable. Ce restaurant ne peut pas absorber la commission Sparow.", ar:"❌ غير مجدٍ. هذا المطعم لا يستطيع تحمل عمولة سبارو." });
  }
  if (zones.critical > 0) {
    recs.push({ level:"critical", fr:`${zones.critical} article(s) critique(s) — exclure de l'app ou revoir le prix.`, ar:`${zones.critical} منتج(ات) حرجة — يُنصح باستبعادها أو مراجعة السعر.` });
  }
  if (worst.length) {
    const names = worst.slice(0,2).map(i => i.name).join(", ");
    recs.push({ level:"amber", fr:`Articles à revoir en priorité : ${names}`, ar:`المنتجات التي تحتاج مراجعة: ${names}` });
  }
  return recs;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDT = v => typeof v === "number" ? v.toFixed(3) : "—";
const fmtPct = v => typeof v === "number" ? v.toFixed(1) + "%" : "—";
const uid = () => Math.random().toString(36).slice(2,10);

function riskColor(pct) {
  if (pct >= 85) return "#991B1B";
  if (pct >= 75) return "#EF4444";
  if (pct >= 60) return "#F59E0B";
  return "#22C55E";
}
function riskBg(pct) {
  if (pct >= 85) return "#991B1B22";
  if (pct >= 75) return "#EF444422";
  if (pct >= 60) return "#F59E0B22";
  return "#22C55E22";
}
function riskLabel(pct) {
  if (pct >= 85) return "Critique";
  if (pct >= 75) return "Risque";
  if (pct >= 60) return "Modéré";
  return "OK";
}
function viabilityColor(v) {
  if (v === "Critique") return "#991B1B";
  if (v === "À Risque") return "#EF4444";
  if (v === "Modéré")   return "#F59E0B";
  return "#22C55E";
}

function newItem(defaultFC) {
  return { id: uid(), name:"", category:"burger", posPrice:"", foodCostPct: defaultFC };
}

const STORAGE_KEY = "sparow_v2";

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("setup");
  const [lang, setLang] = useState("fr");
  const [restaurant, setRestaurant] = useState(DEMO_RESTAURANT);
  const [items, setItems] = useState(DEMO_ITEMS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) { const d = JSON.parse(s); setRestaurant(d.restaurant); setItems(d.items); }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ restaurant, items })); } catch {}
  }, [restaurant, items]);

  const summary = useMemo(() => calcSummary(items, restaurant.portionControl), [items, restaurant.portionControl]);
  const recommendations = useMemo(() => getRecommendations(summary), [summary]);

  function handleCategoryChange(catId) {
    const cat = CATEGORIES.find(c => c.id === catId);
    setRestaurant(r => ({ ...r, category: catId, defaultFC: cat.defaultFC }));
  }
  function addItem() { setItems(p => [...p, newItem(restaurant.defaultFC)]); }
  function removeItem(id) { setItems(p => p.filter(i => i.id !== id)); }
  function updateItem(id, field, value) { setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i)); }
  function loadDemo() { setRestaurant(DEMO_RESTAURANT); setItems(DEMO_ITEMS); setTab("calculator"); }
  function resetAll() {
    setRestaurant({ name:"", city:CITIES[0], category:"burger", portionControl:true, defaultFC:35 });
    setItems([newItem(35)]);
    setTab("setup");
    localStorage.removeItem(STORAGE_KEY);
  }

  const navItems = [
    { id:"setup",       icon:"🏪", labelFr:"Profil",       labelAr:"الملف الشخصي" },
    { id:"calculator",  icon:"🧮", labelFr:"Calculateur",  labelAr:"الحاسبة" },
    { id:"dashboard",   icon:"📊", labelFr:"Dashboard",    labelAr:"لوحة القيادة" },
    { id:"foodcost",    icon:"💰", labelFr:"Food Cost",    labelAr:"تكلفة الطعام" },
    { id:"negotiation", icon:"🤝", labelFr:"Négociation",  labelAr:"التفاوض" },
    { id:"materials",   icon:"📦", labelFr:"Matières",     labelAr:"المواد الأولية" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif", background:"#0B0D13", color:"#E2E4ED", direction: lang==="ar"?"rtl":"ltr" }}>
      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen?228:64, background:"#13151E", borderRight:"1px solid #1E2130", display:"flex", flexDirection:"column", transition:"width .2s", flexShrink:0, overflow:"hidden" }}>
        <div style={{ padding:"20px 14px 14px", borderBottom:"1px solid #1E2130", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:9, background:"linear-gradient(135deg,#FF6B2C,#FF9E5E)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🐦</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:"#fff", letterSpacing:"-0.3px" }}>Sparow</div>
              <div style={{ fontSize:10, color:"#4B5270", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>Food Cost Tool</div>
            </div>
          )}
        </div>

        <nav style={{ flex:1, padding:"10px 0" }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"10px 14px", background: tab===n.id ? "#FF6B2C18":"transparent",
              border:"none", cursor:"pointer", color: tab===n.id ? "#FF8C5A":"#6B7399",
              fontSize:13, fontWeight: tab===n.id?600:400,
              borderLeft: lang==="ar"?"none":"3px solid "+(tab===n.id?"#FF6B2C":"transparent"),
              borderRight: lang==="ar"?"3px solid "+(tab===n.id?"#FF6B2C":"transparent"):"none",
              textAlign:"left", transition:"all .15s", whiteSpace:"nowrap",
            }}>
              <span style={{ fontSize:17, flexShrink:0 }}>{n.icon}</span>
              {sidebarOpen && (lang==="ar" ? n.labelAr : n.labelFr)}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div style={{ padding:"12px 14px", borderTop:"1px solid #1E2130" }}>
            {restaurant.name && summary && (
              <div style={{ background:"#1A1D2A", borderRadius:8, padding:"10px 12px", marginBottom:10 }}>
                <div style={{ fontSize:10, color:"#4B5270", fontWeight:600, textTransform:"uppercase", marginBottom:4 }}>Actif</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#E2E4ED", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{restaurant.name}</div>
                <div style={{ marginTop:5, fontSize:12, color: viabilityColor(summary.viability), fontWeight:700 }}>
                  ● {summary.viability} — {fmtPct(summary.avg)}
                </div>
              </div>
            )}
            <div style={{ display:"flex", gap:6, marginBottom:8 }}>
              {["fr","ar"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  flex:1, padding:"5px 0", border:`1px solid ${lang===l?"#FF6B2C":"#1E2130"}`,
                  borderRadius:6, background: lang===l?"#FF6B2C20":"transparent",
                  color: lang===l?"#FF8C5A":"#4B5270", fontSize:11, fontWeight:600, cursor:"pointer"
                }}>{l==="fr"?"FR 🇫🇷":"AR 🇹🇳"}</button>
              ))}
            </div>
            <button onClick={loadDemo} style={{ width:"100%", padding:"6px", background:"#FF6B2C20", border:"1px solid #FF6B2C40", borderRadius:6, color:"#FF8C5A", fontSize:11, fontWeight:600, cursor:"pointer", marginBottom:6 }}>
              📂 Demo Restaurant
            </button>
            <button onClick={resetAll} style={{ width:"100%", padding:"6px", background:"transparent", border:"1px solid #1E2130", borderRadius:6, color:"#4B5270", fontSize:11, cursor:"pointer" }}>
              🗑 Réinitialiser
            </button>
          </div>
        )}
        <button onClick={() => setSidebarOpen(p=>!p)} style={{ padding:"10px", background:"transparent", border:"none", borderTop:"1px solid #1E2130", cursor:"pointer", color:"#4B5270", fontSize:16 }}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, overflow:"auto", padding:"28px 32px", maxWidth:"100%" }}>
        {tab==="setup" && <SetupTab restaurant={restaurant} setRestaurant={setRestaurant} onCategoryChange={handleCategoryChange} onNext={() => setTab("calculator")} lang={lang} />}
        {tab==="calculator" && <CalculatorTab items={items} restaurant={restaurant} addItem={addItem} removeItem={removeItem} updateItem={updateItem} onNext={() => setTab("dashboard")} lang={lang} summary={summary} />}
        {tab==="dashboard" && <DashboardTab summary={summary} restaurant={restaurant} recommendations={recommendations} lang={lang} />}
        {tab==="foodcost" && <FoodCostTab lang={lang} />}
        {tab==="negotiation" && <NegotiationTab summary={summary} restaurant={restaurant} lang={lang} />}
        {tab==="materials" && <MaterialsTab lang={lang} />}
      </main>
    </div>
  );
}

// ─── SETUP TAB ────────────────────────────────────────────────────────────────
function SetupTab({ restaurant, setRestaurant, onCategoryChange, onNext, lang }) {
  const cat = CATEGORIES.find(c => c.id === restaurant.category);
  const effectiveFC = restaurant.portionControl ? cat?.defaultFC : (cat?.defaultFC || 0) + 5;
  return (
    <div style={{ maxWidth:620 }}>
      <PageHeader icon="🏪" titleFr="Profil Restaurant" titleAr="ملف المطعم" subtitleFr="Configurez le profil du partenaire" subtitleAr="قم بإعداد ملف الشريك" lang={lang} />
      <Card>
        <FormRow labelFr="Nom du restaurant" labelAr="اسم المطعم" lang={lang}>
          <input value={restaurant.name} onChange={e => setRestaurant(r=>({...r,name:e.target.value}))} placeholder="Ex: Burger Palace Tunis" style={inputStyle} />
        </FormRow>
        <FormRow labelFr="Ville / Zone" labelAr="المدينة / المنطقة" lang={lang}>
          <select value={restaurant.city} onChange={e => setRestaurant(r=>({...r,city:e.target.value}))} style={inputStyle}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormRow>
        <FormRow labelFr="Catégorie" labelAr="الفئة" lang={lang}>
          <select value={restaurant.category} onChange={e => onCategoryChange(e.target.value)} style={inputStyle}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </FormRow>

        {/* PORTION CONTROL TOGGLE */}
        <FormRow labelFr="Dosage portions standardisé" labelAr="جرعات معيارية" lang={lang}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
              <div onClick={() => setRestaurant(r=>({...r,portionControl:true}))} style={{ width:44, height:24, borderRadius:12, background: restaurant.portionControl?"#FF6B2C":"#1E2130", border:`1px solid ${restaurant.portionControl?"#FF6B2C":"#2A2D40"}`, position:"relative", cursor:"pointer", transition:"all .2s" }}>
                <div style={{ position:"absolute", top:2, left: restaurant.portionControl?20:2, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
              </div>
              <span style={{ fontSize:13, color: restaurant.portionControl?"#22C55E":"#EF4444", fontWeight:600 }}>
                {restaurant.portionControl ? "✅ OUI — pas de pénalité" : "❌ NON — +5% appliqué"}
              </span>
            </label>
          </div>
        </FormRow>

        <FormRow labelFr="Food cost effectif" labelAr="تكلفة الغذاء الفعلية" lang={lang}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:22, fontWeight:800, color:"#FF8C5A" }}>{effectiveFC}%</span>
            {!restaurant.portionControl && <span style={{ fontSize:12, color:"#EF4444", background:"#EF444415", padding:"2px 8px", borderRadius:4 }}>+5% pénalité portions</span>}
          </div>
        </FormRow>
      </Card>

      {/* Info box */}
      <div style={{ marginTop:14, padding:"14px 16px", background:"#13151E", border:"1px solid #1E2130", borderRadius:10 }}>
        <div style={{ fontSize:11, color:"#4B5270", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Modèle Sparow</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[["Commission","30% prix app"],["Markup app","+10% POS"],["Cible FC","< 60% idéal"],["Zone risque","> 75%"]].map(([k,v]) => (
            <div key={k} style={{ fontSize:13 }}>
              <span style={{ color:"#6B7399" }}>{k}: </span>
              <span style={{ color:"#FF8C5A", fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onNext} disabled={!restaurant.name} style={{ ...primaryBtn, marginTop:20, opacity: restaurant.name?1:0.4 }}>
        {lang==="ar" ? "متابعة ← إدخال القائمة" : "Continuer → Saisie Menu"}
      </button>
    </div>
  );
}

// ─── CALCULATOR TAB ───────────────────────────────────────────────────────────
function CalculatorTab({ items, restaurant, addItem, removeItem, updateItem, onNext, lang, summary }) {
  return (
    <div>
      <PageHeader icon="🧮" titleFr="Calculateur Menu" titleAr="حاسبة القائمة" subtitleFr={restaurant.name} subtitleAr={restaurant.name} lang={lang} />

      {/* Quick stats bar */}
      {summary && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
          <MiniKpi label="Moy. FC" value={fmtPct(summary.avg)} color={riskColor(summary.avg)} />
          <MiniKpi label="✅ OK" value={summary.zones.green} color="#22C55E" />
          <MiniKpi label="⚠️ Modéré" value={summary.zones.amber + summary.zones.red} color="#F59E0B" />
          <MiniKpi label="🔴 Critique" value={summary.zones.critical} color="#991B1B" />
        </div>
      )}

      <div style={{ overflowX:"auto", borderRadius:10, border:"1px solid #1E2130" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
          <thead>
            <tr style={{ background:"#13151E", borderBottom:"1px solid #1E2130" }}>
              {["Article","Catégorie","Prix caisse","FC %","Prix app","Matière","Commission","Nvx FC (DT)","Nvx FC %","Marge","Zone",""].map(h=>(
                <th key={h} style={{ padding:"10px 10px", textAlign:"left", fontSize:10, fontWeight:700, color:"#4B5270", textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const calc = item.posPrice && item.name ? calcItem(item, restaurant.portionControl) : null;
              return (
                <tr key={item.id} style={{ borderBottom:"1px solid #13151E" }}
                  onMouseEnter={e => e.currentTarget.style.background="#16192400"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"7px 10px" }}>
                    <input value={item.name} onChange={e => updateItem(item.id,"name",e.target.value)} placeholder="Nom article" style={{ ...cellInput, width:150 }} />
                  </td>
                  <td style={{ padding:"7px 10px" }}>
                    <select value={item.category} onChange={e => updateItem(item.id,"category",e.target.value)} style={{ ...cellInput, width:130 }}>
                      {CATEGORIES.filter(c=>c.id!=="multi").map(c=><option key={c.id} value={c.id}>{c.label.split("/")[0].trim()}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"7px 10px" }}>
                    <input type="number" value={item.posPrice} onChange={e => updateItem(item.id,"posPrice",e.target.value)} placeholder="0.000" style={{ ...cellInput, width:72 }} />
                  </td>
                  <td style={{ padding:"7px 10px" }}>
                    <input type="number" value={item.foodCostPct} onChange={e => updateItem(item.id,"foodCostPct",e.target.value)} placeholder="35" style={{ ...cellInput, width:52 }} />
                  </td>
                  <td style={{ padding:"7px 10px", color:"#6B7399", fontWeight:500 }}>{calc?fmtDT(calc.appPrice):"—"}</td>
                  <td style={{ padding:"7px 10px", color:"#6B7399" }}>{calc?fmtDT(calc.rawMaterial):"—"}</td>
                  <td style={{ padding:"7px 10px", color:"#FF8C5A", fontWeight:600 }}>{calc?fmtDT(calc.sparowCommission):"—"}</td>
                  <td style={{ padding:"7px 10px", color:"#E2E4ED", fontWeight:700 }}>{calc?fmtDT(calc.newFCAmount):"—"}</td>
                  <td style={{ padding:"7px 10px" }}>
                    {calc ? <span style={{ background:riskBg(calc.newFCPct), color:riskColor(calc.newFCPct), padding:"2px 7px", borderRadius:4, fontSize:12, fontWeight:800 }}>{fmtPct(calc.newFCPct)}</span> : "—"}
                  </td>
                  <td style={{ padding:"7px 10px", fontWeight:700, color: calc?(calc.marginPct<15?"#EF4444":"#22C55E"):"#4B5270" }}>
                    {calc?fmtPct(calc.marginPct):"—"}
                  </td>
                  <td style={{ padding:"7px 10px" }}>
                    {calc ? <span style={{ background:riskBg(calc.newFCPct), color:riskColor(calc.newFCPct), padding:"2px 6px", borderRadius:4, fontSize:10, fontWeight:700 }}>{riskLabel(calc.newFCPct)}</span> : "—"}
                  </td>
                  <td style={{ padding:"7px 6px" }}>
                    <button onClick={() => removeItem(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#2A2D40", fontSize:18, lineHeight:1, padding:"2px 4px" }} title="Supprimer">×</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
        <button onClick={addItem} style={secondaryBtn}>+ Ajouter article</button>
        <button onClick={onNext} disabled={!items.some(i=>i.name&&i.posPrice)} style={{ ...primaryBtn, opacity: items.some(i=>i.name&&i.posPrice)?1:0.4 }}>
          {lang==="ar"?"عرض لوحة القيادة ←":"Voir Dashboard →"}
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────────
function DashboardTab({ summary, restaurant, recommendations, lang }) {
  if (!summary) return <EmptyState icon="📊" msg="Ajoutez des articles dans le calculateur pour voir le dashboard." />;

  const chartData = summary.calculated.map(i => ({
    name: i.name.length>13 ? i.name.slice(0,13)+"…":i.name,
    fc: parseFloat(i.newFCPct.toFixed(1)),
    full: i.name,
  }));

  const zoneData = [
    { name:"OK (<60%)",    value: summary.zones.green,    fill:"#22C55E" },
    { name:"Modéré",       value: summary.zones.amber,    fill:"#F59E0B" },
    { name:"Risque",       value: summary.zones.red,      fill:"#EF4444" },
    { name:"Critique",     value: summary.zones.critical, fill:"#991B1B" },
  ].filter(z=>z.value>0);

  return (
    <div>
      <PageHeader icon="📊" titleFr="Dashboard" titleAr="لوحة القيادة" subtitleFr={restaurant.name} subtitleAr={restaurant.name} lang={lang} />

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <KpiCard label="Food Cost Moyen" value={fmtPct(summary.avg)} color={riskColor(summary.avg)} />
        <KpiCard label="Viabilité" value={summary.viability} color={viabilityColor(summary.viability)} />
        <KpiCard label="Articles analysés" value={summary.calculated.length} color="#6B7399" />
        <KpiCard label="Zone critique" value={summary.zones.critical} sub=">85%" color="#991B1B" />
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:14, marginBottom:14 }}>
        <Card titleFr="Food Cost % par article" titleAr="تكلفة الغذاء حسب المنتج" lang={lang}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top:8, right:8, left:-16, bottom:8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2130" />
              <XAxis dataKey="name" tick={{ fill:"#4B5270", fontSize:10 }} />
              <YAxis domain={[0,100]} tick={{ fill:"#4B5270", fontSize:10 }} tickFormatter={v=>v+"%"} />
              <Tooltip contentStyle={{ background:"#13151E", border:"1px solid #1E2130", borderRadius:8, fontSize:12 }} labelStyle={{ color:"#E2E4ED" }} formatter={(v,_,p)=>[fmtPct(v), p.payload.full]} />
              <Bar dataKey="fc" radius={[4,4,0,0]} maxBarSize={36}>
                {chartData.map((e,i) => <Cell key={i} fill={riskColor(e.fc)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:16, marginTop:8, flexWrap:"wrap" }}>
            {[["#22C55E","< 60% OK"],["#F59E0B","60–75% Modéré"],["#EF4444","75–85% Risque"],["#991B1B","> 85% Critique"]].map(([c,l])=>(
              <span key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#6B7399" }}>
                <span style={{ width:9, height:9, borderRadius:2, background:c, display:"inline-block" }} />{l}
              </span>
            ))}
          </div>
        </Card>

        <Card titleFr="Répartition zones" titleAr="توزيع المناطق" lang={lang}>
          {zoneData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart innerRadius="30%" outerRadius="90%" data={zoneData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={4} />
                  <Legend iconSize={8} formatter={(v) => <span style={{ fontSize:10, color:"#6B7399" }}>{v}</span>} />
                  <Tooltip contentStyle={{ background:"#13151E", border:"1px solid #1E2130", borderRadius:8, fontSize:12 }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div style={{ color:"#4B5270", fontSize:12, textAlign:"center", paddingTop:40 }}>Aucune donnée</div>
          )}
        </Card>
      </div>

      {/* Best / Worst */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card titleFr="🏆 Meilleurs articles" titleAr="🏆 أفضل المنتجات" lang={lang}>
          {summary.best.map(i=><ItemRow key={i.id} name={i.name} pct={i.newFCPct} />)}
        </Card>
        <Card titleFr="⚠️ Articles à risque" titleAr="⚠️ منتجات في خطر" lang={lang}>
          {summary.worst.map(i=><ItemRow key={i.id} name={i.name} pct={i.newFCPct} />)}
        </Card>
      </div>

      {/* Recommendations */}
      <Card titleFr="💡 Recommandations" titleAr="💡 التوصيات" lang={lang}>
        {recommendations.map((rec,i) => (
          <div key={i} style={{ padding:"12px 14px", borderRadius:8, marginBottom:10, background: rec.level==="critical"?"#991B1B15":rec.level==="red"?"#EF444415":rec.level==="amber"?"#F59E0B15":"#22C55E15", borderLeft:`3px solid ${rec.level==="critical"?"#991B1B":rec.level==="red"?"#EF4444":rec.level==="amber"?"#F59E0B":"#22C55E"}` }}>
            <div style={{ fontSize:13, color:"#E2E4ED", marginBottom:6 }}>🇫🇷 {rec.fr}</div>
            <div style={{ fontSize:13, color:"#9CA3AF", textAlign:"right", direction:"rtl", fontFamily:"Tahoma,Arial,sans-serif" }}>🇹🇳 {rec.ar}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── NEGOTIATION TAB ──────────────────────────────────────────────────────────
function NegotiationTab({ summary, restaurant, lang }) {
  const [targetFC, setTargetFC] = useState(65);
  const [commRate, setCommRate] = useState(25);
  if (!summary) return <EmptyState icon="🤝" msg="Complétez le calculateur pour accéder à la négociation." />;

  return (
    <div style={{ maxWidth:800 }}>
      <PageHeader icon="🤝" titleFr="Aide à la Négociation" titleAr="مساعدة التفاوض" subtitleFr={restaurant.name} subtitleAr={restaurant.name} lang={lang} />

      {/* Commission scenarios */}
      <Card titleFr="Simulation par taux de commission" titleAr="محاكاة معدل العمولة" lang={lang}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16, flexWrap:"wrap" }}>
          <span style={{ fontSize:13, color:"#6B7399" }}>Commission :</span>
          {[30,25,20].map(r => (
            <button key={r} onClick={() => setCommRate(r)} style={{ padding:"6px 16px", borderRadius:6, border:`1px solid ${commRate===r?"#FF6B2C":"#1E2130"}`, background: commRate===r?"#FF6B2C20":"transparent", color: commRate===r?"#FF8C5A":"#6B7399", cursor:"pointer", fontSize:13, fontWeight: commRate===r?700:400 }}>
              {r}%
            </button>
          ))}
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
            <thead>
              <tr style={{ background:"#13151E" }}>
                {["Article","Prix app","Commission","Nvx FC (DT)","Nvx FC %","Marge","Δ vs 30%"].map(h=>(
                  <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:10, color:"#4B5270", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.calculated.map(item => {
                const comm = item.appPrice * (commRate/100);
                const newFC = item.rawMaterial + comm;
                const newFCPct = item.appPrice > 0 ? (newFC/item.appPrice)*100 : 0;
                const margin = 100-newFCPct;
                const delta = newFCPct - item.newFCPct;
                return (
                  <tr key={item.id} style={{ borderBottom:"1px solid #13151E" }}>
                    <td style={{ padding:"7px 10px", fontWeight:600 }}>{item.name}</td>
                    <td style={{ padding:"7px 10px", color:"#6B7399" }}>{fmtDT(item.appPrice)} DT</td>
                    <td style={{ padding:"7px 10px", color:"#FF8C5A", fontWeight:600 }}>{fmtDT(comm)} DT</td>
                    <td style={{ padding:"7px 10px", fontWeight:700 }}>{fmtDT(newFC)} DT</td>
                    <td style={{ padding:"7px 10px" }}>
                      <span style={{ background:riskBg(newFCPct), color:riskColor(newFCPct), padding:"2px 7px", borderRadius:4, fontSize:12, fontWeight:800 }}>{fmtPct(newFCPct)}</span>
                    </td>
                    <td style={{ padding:"7px 10px", color: margin<15?"#EF4444":"#22C55E", fontWeight:700 }}>{fmtPct(margin)}</td>
                    <td style={{ padding:"7px 10px", color: delta<0?"#22C55E":"#EF4444", fontWeight:700, fontSize:12 }}>
                      {delta<0?"-":"+"}:{Math.abs(delta).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Max commission calculator */}
      <Card titleFr="Taux de commission max pour atteindre l'objectif" titleAr="الحد الأقصى للعمولة لتحقيق الهدف" lang={lang} style={{ marginTop:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16, flexWrap:"wrap" }}>
          <span style={{ fontSize:13, color:"#6B7399" }}>Cible food cost :</span>
          <input type="range" min="40" max="80" value={targetFC} onChange={e => setTargetFC(Number(e.target.value))} style={{ flex:1, minWidth:120, accentColor:"#FF6B2C" }} />
          <span style={{ fontSize:18, fontWeight:800, color:"#FF8C5A", minWidth:48 }}>{targetFC}%</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
            <thead>
              <tr style={{ background:"#13151E" }}>
                {["Article","Prix app","Matière","Comm. max","Taux max %","Faisable ?"].map(h=>(
                  <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:10, color:"#4B5270", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.calculated.map(item => {
                const maxCommPct = ((targetFC/100)*item.appPrice - item.rawMaterial)/item.appPrice*100;
                const maxCommDT = item.appPrice * (maxCommPct/100);
                const ok = maxCommPct >= 30;
                return (
                  <tr key={item.id} style={{ borderBottom:"1px solid #13151E" }}>
                    <td style={{ padding:"7px 10px", fontWeight:600 }}>{item.name}</td>
                    <td style={{ padding:"7px 10px", color:"#6B7399" }}>{fmtDT(item.appPrice)} DT</td>
                    <td style={{ padding:"7px 10px", color:"#6B7399" }}>{fmtDT(item.rawMaterial)} DT</td>
                    <td style={{ padding:"7px 10px", color: ok?"#22C55E":"#EF4444", fontWeight:700 }}>{fmtDT(maxCommDT)} DT</td>
                    <td style={{ padding:"7px 10px", fontWeight:800, color: ok?"#22C55E":"#EF4444" }}>{fmtPct(maxCommPct)}</td>
                    <td style={{ padding:"7px 10px" }}>
                      <span style={{ background: ok?"#22C55E20":"#EF444420", color: ok?"#22C55E":"#EF4444", padding:"2px 8px", borderRadius:4, fontSize:11, fontWeight:700 }}>
                        {ok ? "✅ OK" : "❌ Sous 30%"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MATERIALS TAB ────────────────────────────────────────────────────────────
function MaterialsTab({ lang }) {
  const [search, setSearch] = useState("");
  const filtered = RAW_MATERIALS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader icon="📦" titleFr="Base Matières Premières" titleAr="قاعدة بيانات المواد الأولية" subtitleFr={`${RAW_MATERIALS.length} ingrédients disponibles`} subtitleAr={`${RAW_MATERIALS.length} مواد متاحة`} lang={lang} />
      <div style={{ marginBottom:14 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher un ingrédient..." style={{ ...inputStyle, maxWidth:360 }} />
      </div>
      <div style={{ overflowX:"auto", borderRadius:10, border:"1px solid #1E2130" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
          <thead>
            <tr style={{ background:"#13151E" }}>
              {["ID","Ingrédient","Unité","Utilisable %","Prix unitaire","Prix/g ou /pcs"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:10, color:"#4B5270", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m=>(
              <tr key={m.id} style={{ borderBottom:"1px solid #13151E" }}
                onMouseEnter={e=>e.currentTarget.style.background="#13151E"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"8px 12px", color:"#FF8C5A", fontWeight:700, fontSize:11 }}>{m.id}</td>
                <td style={{ padding:"8px 12px", fontWeight:600, color:"#E2E4ED" }}>{m.name}</td>
                <td style={{ padding:"8px 12px", color:"#6B7399" }}>{m.unit}</td>
                <td style={{ padding:"8px 12px", color:"#6B7399" }}>{m.usable}%</td>
                <td style={{ padding:"8px 12px", color:"#E2E4ED", fontWeight:600 }}>{m.unitPrice.toFixed(2)} DT</td>
                <td style={{ padding:"8px 12px", color:"#22C55E", fontWeight:700 }}>
                  {m.isPcs ? `${m.pricePerG.toFixed(4)} DT/pcs` : `${m.pricePerG.toFixed(5)} DT/g`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:10, fontSize:11, color:"#4B5270" }}>
        {filtered.length} résultat(s) — Données Sparow Food Tunisia 2025
      </div>
    </div>
  );
}

// ─── FOOD COST TAB ────────────────────────────────────────────────────────────
function FoodCostTab({ lang }) {
  return (
    <div>
      <PageHeader icon="💰" titleFr="Food Cost" titleAr="تكلفة الطعام" subtitleFr="Section en cours de développement" subtitleAr="القسم قيد التطوير" lang={lang} />
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function PageHeader({ icon, titleFr, titleAr, subtitleFr, subtitleAr, lang }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:3 }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <h1 style={{ margin:0, fontSize:21, fontWeight:800, color:"#fff", letterSpacing:"-0.4px" }}>
          {lang==="ar" ? titleAr : titleFr}
        </h1>
      </div>
      <p style={{ margin:0, fontSize:12, color:"#4B5270", marginLeft:32 }}>
        {lang==="ar" ? subtitleAr : subtitleFr}
      </p>
    </div>
  );
}

function Card({ titleFr, titleAr, lang, children, style={} }) {
  return (
    <div style={{ background:"#13151E", border:"1px solid #1E2130", borderRadius:12, padding:"16px 18px", ...style }}>
      {(titleFr || titleAr) && (
        <div style={{ fontSize:11, fontWeight:700, color:"#4B5270", marginBottom:14, textTransform:"uppercase", letterSpacing:"0.06em" }}>
          {lang==="ar" ? titleAr : titleFr}
        </div>
      )}
      {children}
    </div>
  );
}

function FormRow({ labelFr, labelAr, lang, children }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", alignItems:"center", gap:12, marginBottom:14 }}>
      <label style={{ fontSize:13, color:"#6B7399", fontWeight:500 }}>{lang==="ar" ? labelAr : labelFr}</label>
      {children}
    </div>
  );
}

function KpiCard({ label, value, color, sub }) {
  return (
    <div style={{ background:"#13151E", border:"1px solid #1E2130", borderRadius:12, padding:"14px 16px" }}>
      <div style={{ fontSize:10, color:"#4B5270", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:800, color: color||"#E2E4ED", letterSpacing:"-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize:10, color:"#4B5270", marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function MiniKpi({ label, value, color }) {
  return (
    <div style={{ background:"#13151E", border:"1px solid #1E2130", borderRadius:8, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:12, color:"#6B7399" }}>{label}</span>
      <span style={{ fontSize:16, fontWeight:800, color }}>{value}</span>
    </div>
  );
}

function ItemRow({ name, pct }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #1E2130" }}>
      <span style={{ fontSize:13, color:"#E2E4ED" }}>{name}</span>
      <span style={{ fontSize:12, fontWeight:800, color:riskColor(pct), background:riskBg(pct), padding:"2px 8px", borderRadius:4 }}>{fmtPct(pct)}</span>
    </div>
  );
}

function EmptyState({ icon, msg }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:360, color:"#4B5270", gap:12 }}>
      <div style={{ fontSize:48 }}>{icon}</div>
      <div style={{ fontSize:14, textAlign:"center", maxWidth:320 }}>{msg}</div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const inputStyle = {
  background:"#1A1D2A", border:"1px solid #1E2130", borderRadius:8,
  padding:"9px 12px", color:"#E2E4ED", fontSize:13, outline:"none",
  width:"100%", boxSizing:"border-box", transition:"border-color .15s",
};
const cellInput = {
  background:"#1A1D2A", border:"1px solid #1E2130", borderRadius:6,
  padding:"5px 8px", color:"#E2E4ED", fontSize:12, outline:"none", boxSizing:"border-box",
};
const primaryBtn = {
  padding:"11px 24px", background:"linear-gradient(135deg,#FF6B2C,#FF9E5E)",
  border:"none", borderRadius:8, color:"#fff", fontSize:14, fontWeight:700,
  cursor:"pointer", letterSpacing:"-0.2px",
};
const secondaryBtn = {
  padding:"11px 18px", background:"#1A1D2A", border:"1px solid #1E2130",
  borderRadius:8, color:"#6B7399", fontSize:13, fontWeight:500, cursor:"pointer",
};
