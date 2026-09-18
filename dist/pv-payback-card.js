const Tt = 18300;
class De extends Map {
  constructor(e = 20) {
    super(), this.maximumEntries = e;
  }
  maximumEntries;
  get(e) {
    const t = super.get(e);
    return t !== void 0 && (super.delete(e), super.set(e, t)), t;
  }
  set(e, t) {
    for (super.has(e) && super.delete(e), super.set(e, t); this.size > this.maximumEntries; ) {
      const n = this.keys().next().value;
      if (n === void 0) break;
      super.delete(n);
    }
    return this;
  }
}
const de = new De(), pe = new De();
function V(i) {
  return i === "Wh" || i === "kWh" || i === "MWh";
}
function te(i, e) {
  if (!(!Number.isFinite(i) || !V(e)))
    return e === "Wh" ? i / 1e3 : e === "MWh" ? i * 1e3 : i;
}
function je(i) {
  return {
    ...i,
    display_style: i.display_style ?? "full",
    show_breakdown: i.show_breakdown ?? !0,
    show_energy_values: i.show_energy_values ?? !0,
    show_money_values: i.show_money_values ?? !0,
    show_payback_date: i.show_payback_date ?? !0,
    show_progress: i.show_progress ?? !0,
    show_contribution_segments: i.show_contribution_segments ?? !1,
    use_location_seasonality: i.use_location_seasonality ?? !1,
    annual_discount_rate: i.annual_discount_rate ?? 0,
    apply_annual_discount: i.apply_annual_discount ?? i.use_historical_statistics ?? !1
  };
}
function ie(i) {
  return i.apply_annual_discount ?? i.use_historical_statistics ?? !1;
}
function he(i, e) {
  return !i || i === "PV-Amortisation" || i === "PV payback" ? e : i;
}
function Ie(i, e, t, n) {
  if (t <= 0 || i > e) return;
  const s = Math.max(1, (e.getTime() - i.getTime()) / 864e5);
  return new Date(i.getTime() + n / t * s * 864e5);
}
function x(i) {
  return new Date(i.getFullYear(), i.getMonth(), i.getDate());
}
function N(i, e) {
  const t = new Date(i.getFullYear(), 0, 0), n = Math.round((x(i).getTime() - t.getTime()) / 864e5), s = e * Math.PI / 180, o = 0.409 * Math.sin(2 * Math.PI * n / 365 - 1.39), a = -Math.tan(s) * Math.tan(o), r = Math.acos(Math.max(-1, Math.min(1, a))), c = r * Math.sin(s) * Math.sin(o) + Math.cos(s) * Math.cos(o) * Math.sin(r);
  return Math.max(0, c);
}
function Ke(i, e, t, n, s) {
  const o = /* @__PURE__ */ new Date(`${i}T00:00:00`);
  if (Number.isNaN(o.getTime()) || !Number.isFinite(e.getTime()) || !Number.isFinite(t) || t <= 0 || !Number.isFinite(n) || n <= 0 || !Number.isFinite(s) || s < -90 || s > 90 || o > e)
    return;
  const a = x(e);
  let r = 0;
  for (let d = x(o); d <= a; d.setDate(d.getDate() + 1))
    r += N(d, s);
  if (!Number.isFinite(r) || r <= 0) return;
  const c = t / r, u = Math.max(1e-9, n * Number.EPSILON * 16);
  if (t >= n) {
    let d = 0;
    for (let g = x(o); g <= a; g.setDate(g.getDate() + 1))
      if (d += N(g, s) * c, d >= n - u) return new Date(g);
    return;
  }
  let p = t;
  const l = new Date(a);
  for (let d = 0; d < 18300; d += 1) {
    if (p >= n - u) return new Date(l);
    l.setDate(l.getDate() + 1), p += N(l, s) * c;
  }
}
function Y(i, e) {
  return typeof i == "number" && Number.isFinite(i) && i >= -90 && i <= 90 && typeof e == "number" && Number.isFinite(e) && e >= -180 && e <= 180;
}
function k(i) {
  return [
    i.getFullYear(),
    String(i.getMonth() + 1).padStart(2, "0"),
    String(i.getDate()).padStart(2, "0")
  ].join("-");
}
function Z(i, e, t) {
  const n = Math.max(
    0,
    (x(i).getTime() - x(e).getTime()) / 864e5
  );
  return 1 / (1 + t / 100) ** (n / 365.2425);
}
function Be(i) {
  const e = i.start ?? i.start_time;
  if (typeof e == "number")
    return !Number.isFinite(e) || Number.isNaN(new Date(e).getTime()) ? void 0 : k(new Date(e));
  if (!(typeof e != "string" || Number.isNaN(new Date(e).getTime())))
    return e.slice(0, 10);
}
function Q(i) {
  const e = /* @__PURE__ */ new Map();
  let t;
  for (const n of i ?? []) {
    const s = Be(n), o = typeof n.sum == "number" ? n.sum : Number.NaN;
    if (!s || !Number.isFinite(o)) {
      t = void 0;
      continue;
    }
    if (t !== void 0) {
      const a = o - t;
      a >= 0 && e.set(s, a);
    }
    t = o;
  }
  return e;
}
function _e(i, e) {
  const t = Q(e?.[i.export_energy_entity]), n = i.self_consumption_entity ? Q(e?.[i.self_consumption_entity]) : void 0, s = i.production_energy_entity ? Q(e?.[i.production_energy_entity]) : void 0;
  return [.../* @__PURE__ */ new Set([
    ...t.keys(),
    ...n?.keys() ?? [],
    ...s?.keys() ?? []
  ])].sort().flatMap((a) => {
    const r = t.get(a);
    if (r === void 0) return [];
    const c = n ? n.get(a) : s?.get(a) === void 0 ? void 0 : Math.max(0, s.get(a) - r);
    return c === void 0 || !Number.isFinite(c) || c < 0 ? [] : [{ date: a, selfConsumption: c, exported: r }];
  });
}
function Ce(i, e) {
  const t = i.self_consumption_entity ? ["direct", i.self_consumption_entity, i.export_energy_entity] : ["derived", i.production_energy_entity, i.export_energy_entity];
  return JSON.stringify([t, i.start_date, e]);
}
function Le(i, e, t = /* @__PURE__ */ new Date()) {
  if (!i.callWS || !ie(e) || (e.annual_discount_rate ?? 0) <= 0)
    return;
  const n = /* @__PURE__ */ new Date(`${e.start_date}T00:00:00`);
  if (Number.isNaN(n.getTime()) || Number.isNaN(t.getTime())) return;
  const s = x(n);
  s.setDate(s.getDate() - 1);
  const o = x(t), a = x(t);
  a.setDate(a.getDate() - 1);
  const r = k(a), c = Ce(e, r), u = de.get(c);
  if (u) return u;
  const p = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity], l = i.callWS({
    type: "recorder/statistics_during_period",
    start_time: `${k(s)}T00:00:00`,
    end_time: `${k(o)}T00:00:00`,
    statistic_ids: p,
    period: "day",
    types: ["sum"]
  }).then(
    (d) => d && typeof d == "object" ? d : void 0
  ).catch(() => {
  });
  return de.set(c, l), l;
}
function qe(i, e, t, n) {
  const s = i.use_location_seasonality && Y(n?.latitude, n?.longitude), o = [];
  for (let r = x(e); r <= x(t); r.setDate(r.getDate() + 1))
    o.push({
      date: new Date(r),
      weight: s ? N(r, n.latitude) : 1
    });
  return o.reduce((r, c) => r + c.weight, 0) > 0 ? o : o.map((r) => ({ ...r, weight: 1 }));
}
function Ye(i, e, t, n, s, o) {
  const a = /* @__PURE__ */ new Date(`${i.start_date}T00:00:00`);
  if (Number.isNaN(a.getTime()) || a > n) return [];
  const r = qe(i, a, n, s), c = new Map((o ?? []).map((d) => [d.date, d])), u = (d, g) => {
    const m = r.map(
      ({ date: w }) => Math.max(0, c.get(k(w))?.[g] ?? 0)
    ), $ = m.reduce((w, v) => w + v, 0), f = r.reduce(
      (w, v, E) => w + (m[E] > 0 ? 0 : v.weight),
      0
    ), _ = r.map((w, v) => $ > 0 && m[v] > 0 ? m[v] : f > 0 ? d * w.weight / f : 0), S = _.reduce((w, v) => w + v, 0);
    return S > 0 ? _.map((w) => w * d / S) : _;
  }, p = u(Math.max(0, e), "selfConsumption"), l = u(Math.max(0, t), "exported");
  return r.map((d, g) => ({
    date: k(d.date),
    selfConsumption: p[g],
    exported: l[g]
  }));
}
function Je(i, e, t, n) {
  const s = /* @__PURE__ */ new Date(`${i.start_date}T00:00:00`), o = i.annual_discount_rate ?? 0;
  let a = 0, r = 0, c = 0, u;
  for (const $ of t) {
    const f = /* @__PURE__ */ new Date(`${$.date}T00:00:00`), _ = $.selfConsumption * i.electricity_price * Z(f, s, o), S = $.exported * i.feed_in_tariff * Z(f, s, o);
    a += _, r += S, c += _ + S, !u && c >= i.investment_cost && (u = f);
  }
  if (u) return { ownValue: a, exportValue: r, paybackDate: u };
  const p = i.use_location_seasonality && Y(n?.latitude, n?.longitude), l = t.reduce(
    ($, f) => $ + (p ? N(/* @__PURE__ */ new Date(`${f.date}T00:00:00`), n.latitude) : 1),
    0
  ), d = t.reduce(
    ($, f) => $ + f.selfConsumption * i.electricity_price + f.exported * i.feed_in_tariff,
    0
  );
  if (l <= 0 || d <= 0) return { ownValue: a, exportValue: r };
  const g = d / l, m = x(e);
  for (let $ = 0; $ < 18300; $ += 1) {
    m.setDate(m.getDate() + 1);
    const f = p ? N(m, n.latitude) : 1;
    if (c += g * f * Z(m, s, o), c >= i.investment_cost)
      return { ownValue: a, exportValue: r, paybackDate: new Date(m) };
  }
  return { ownValue: a, exportValue: r };
}
function B(i, e, t, n = /* @__PURE__ */ new Date(), s, o) {
  const a = Math.max(0, t - (i.export_energy_baseline ?? 0)), r = i.self_consumption_entity ? Math.max(0, e - (i.self_consumption_baseline ?? 0)) : Math.max(
    0,
    e - (i.production_energy_baseline ?? 0) - a
  ), c = r * i.electricity_price, u = a * i.feed_in_tariff;
  if (ie(i) && (i.annual_discount_rate ?? 0) > 0) {
    const w = Ye(
      i,
      r,
      a,
      n,
      s,
      o
    ), v = Je(i, n, w, s), E = v.ownValue + v.exportValue;
    return {
      selfConsumption: r,
      exported: a,
      ownValue: v.ownValue,
      exportValue: v.exportValue,
      benefit: E,
      progress: Math.min(100, E / i.investment_cost * 100),
      paybackDate: v.paybackDate
    };
  }
  const p = c, l = u, d = p + l, g = Math.min(100, d / i.investment_cost * 100), m = /* @__PURE__ */ new Date(`${i.start_date}T00:00:00`), $ = Ie(m, n, d, i.investment_cost), f = s?.latitude, _ = s?.longitude, S = i.use_location_seasonality && Y(f, _) ? Ke(
    i.start_date,
    n,
    d,
    i.investment_cost,
    f
  ) ?? $ : $;
  return {
    selfConsumption: r,
    exported: a,
    ownValue: p,
    exportValue: l,
    benefit: d,
    progress: g,
    paybackDate: S
  };
}
function Xe(i, e, t, n = /* @__PURE__ */ new Date(), s, o, a = i.annual_discount_rate ?? 3) {
  const r = {
    ...i,
    apply_annual_discount: !1,
    use_historical_statistics: !1
  };
  return {
    linear: B(
      { ...r, use_location_seasonality: !1, annual_discount_rate: 0 },
      e,
      t,
      n,
      s,
      o
    ),
    seasonal: B(
      { ...r, use_location_seasonality: !0, annual_discount_rate: 0 },
      e,
      t,
      n,
      s,
      o
    ),
    discounted: B(
      {
        ...r,
        use_location_seasonality: !0,
        annual_discount_rate: a,
        apply_annual_discount: !0
      },
      e,
      t,
      n,
      s,
      o
    )
  };
}
function U(i, e) {
  const t = !!i.self_consumption_entity;
  return `pv-payback-card:last-valid:${JSON.stringify([
    t ? "direct-self-consumption" : "derived-self-consumption",
    t ? i.self_consumption_entity : i.production_energy_entity,
    i.export_energy_entity,
    i.start_date,
    i.self_consumption_baseline ?? 0,
    i.production_energy_baseline ?? 0,
    i.export_energy_baseline ?? 0
  ])}:${e}`;
}
function Ge(i, e) {
  if (i)
    for (let t = i.length - 1; t >= 0; t -= 1) {
      const n = i[t], s = n.s ?? n.state;
      if (typeof s == "string" && s.trim() === "" || s === null || s === void 0)
        continue;
      const o = typeof s == "number" ? s : Number(s), a = te(o, e);
      if (a === void 0 || a < 0) continue;
      const r = typeof n.last_updated == "string" ? n.last_updated : typeof n.lu == "number" && Number.isFinite(n.lu) ? new Date(n.lu * 1e3).toISOString() : void 0;
      return { value: a, timestamp: r };
    }
}
function Ze(i, e, t = /* @__PURE__ */ new Date()) {
  const n = Object.keys(e).sort();
  if (!i.callWS || n.length === 0 || Number.isNaN(t.getTime())) return;
  const s = Math.floor(t.getTime() / (300 * 1e3)), o = JSON.stringify([n, s]), a = pe.get(o);
  if (a) return a;
  const r = new Date(t.getTime() - 1440 * 60 * 1e3), c = i.callWS({
    type: "history/history_during_period",
    start_time: r.toISOString(),
    end_time: t.toISOString(),
    entity_ids: n,
    include_start_time_state: !0,
    significant_changes_only: !0,
    minimal_response: !0,
    no_attributes: !0
  }).then((u) => {
    if (!u || typeof u != "object") return {};
    const p = u;
    return Object.fromEntries(
      n.flatMap((l) => {
        const d = Ge(p[l], e[l]);
        return d ? [[l, d]] : [];
      })
    );
  }).catch(() => ({}));
  return pe.set(o, c), c;
}
function Qe(i) {
  if (i)
    try {
      const e = JSON.parse(i);
      return typeof e.value != "number" || !Number.isFinite(e.value) || e.value < 0 ? void 0 : {
        value: e.value,
        timestamp: typeof e.timestamp == "string" ? e.timestamp : void 0
      };
    } catch {
      return;
    }
}
function ge(i, e) {
  try {
    return Qe(i.getItem(e));
  } catch {
    return;
  }
}
function et(i, e) {
  return i !== void 0 && i >= 0 ? e && i < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: i, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function tt(i) {
  if (i.display_style !== void 0 && !["full", "compact"].includes(i.display_style))
    return "display_style";
  if (!i.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${i.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const e of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(i[e]) || i[e] < 0) return e;
  if (i.investment_cost <= 0) return "investment_cost";
  for (const e of [
    "self_consumption_baseline",
    "production_energy_baseline",
    "export_energy_baseline"
  ]) {
    const t = i[e];
    if (t !== void 0 && !Number.isFinite(t)) return e;
  }
  if (!Number.isFinite(i.annual_discount_rate ?? 0) || (i.annual_discount_rate ?? 0) < 0)
    return "annual_discount_rate";
  if (!i.export_energy_entity || !i.self_consumption_entity && !i.production_energy_entity)
    return "energy entity";
}
function nt(i) {
  if (!i || typeof i != "object" || Array.isArray(i))
    throw new Error("Invalid configuration: expected an object.");
  const e = i;
  if (e.type !== "custom:pv-payback-card")
    throw new Error("Invalid configuration: type must be custom:pv-payback-card.");
  if (typeof e.export_energy_entity != "string" || !e.export_energy_entity.trim())
    throw new Error("Invalid configuration: export_energy_entity is required.");
  const t = typeof e.self_consumption_entity == "string" && e.self_consumption_entity.trim().length > 0, n = typeof e.production_energy_entity == "string" && e.production_energy_entity.trim().length > 0;
  if (!t && !n)
    throw new Error(
      "Invalid configuration: self_consumption_entity or production_energy_entity is required."
    );
}
const L = globalThis, se = L.ShadowRoot && (L.ShadyCSS === void 0 || L.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, oe = /* @__PURE__ */ Symbol(), me = /* @__PURE__ */ new WeakMap();
let Me = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = !0, n !== oe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (se && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = me.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && me.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const it = (i) => new Me(typeof i == "string" ? i : i + "", void 0, oe), Te = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((n, s, o) => n + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[o + 1], i[0]);
  return new Me(t, i, oe);
}, st = (i, e) => {
  if (se) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const n = document.createElement("style"), s = L.litNonce;
    s !== void 0 && n.setAttribute("nonce", s), n.textContent = t.cssText, i.appendChild(n);
  }
}, ye = se ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules) t += n.cssText;
  return it(t);
})(i) : i;
const { is: ot, defineProperty: at, getOwnPropertyDescriptor: rt, getOwnPropertyNames: ct, getOwnPropertySymbols: lt, getPrototypeOf: ut } = Object, J = globalThis, fe = J.trustedTypes, dt = fe ? fe.emptyScript : "", pt = J.reactiveElementPolyfillSupport, z = (i, e) => i, ne = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? dt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, Ne = (i, e) => !ot(i, e), be = { attribute: !0, type: String, converter: ne, reflect: !1, useDefault: !1, hasChanged: Ne };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), J.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let T = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = be) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const n = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, n, t);
      s !== void 0 && at(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: s, set: o } = rt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: s, set(a) {
      const r = s?.call(this);
      o?.call(this, a), this.requestUpdate(e, r, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? be;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = ut(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, n = [...ct(t), ...lt(t)];
      for (const s of n) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [n, s] of t) this.elementProperties.set(n, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, n] of this.elementProperties) {
      const s = this._$Eu(t, n);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const s of n) t.unshift(ye(s));
    } else e !== void 0 && t.push(ye(e));
    return t;
  }
  static _$Eu(e, t) {
    const n = t.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return st(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, n) {
    this._$AK(e, n);
  }
  _$ET(e, t) {
    const n = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, n);
    if (s !== void 0 && n.reflect === !0) {
      const o = (n.converter?.toAttribute !== void 0 ? n.converter : ne).toAttribute(t, n.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const n = this.constructor, s = n._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = n.getPropertyOptions(s), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : ne;
      this._$Em = s;
      const r = a.fromAttribute(t, o.type);
      this[s] = r ?? this._$Ej?.get(s) ?? r, this._$Em = null;
    }
  }
  requestUpdate(e, t, n, s = !1, o) {
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? Ne)(o, t) || n.useDefault && n.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: n, reflect: s, wrapped: o }, a) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), o !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [s, o] of n) {
        const { wrapped: a } = o, r = this[s];
        a !== !0 || this._$AL.has(s) || r === void 0 || this.C(s, void 0, o, r);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (n) {
      throw e = !1, this._$EM(), n;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[z("elementProperties")] = /* @__PURE__ */ new Map(), T[z("finalized")] = /* @__PURE__ */ new Map(), pt?.({ ReactiveElement: T }), (J.reactiveElementVersions ??= []).push("2.1.2");
const ae = globalThis, ve = (i) => i, q = ae.trustedTypes, $e = q ? q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Pe = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Oe = "?" + A, ht = `<${Oe}>`, M = document, H = () => M.createComment(""), j = (i) => i === null || typeof i != "object" && typeof i != "function", re = Array.isArray, _t = (i) => re(i) || typeof i?.[Symbol.iterator] == "function", ee = `[ 	
\f\r]`, F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, we = /-->/g, xe = />/g, D = RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Se = /'/g, Ae = /"/g, We = /^(?:script|style|textarea|title)$/i, gt = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), y = gt(1), O = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), ke = /* @__PURE__ */ new WeakMap(), C = M.createTreeWalker(M, 129);
function Re(i, e) {
  if (!re(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $e !== void 0 ? $e.createHTML(e) : e;
}
const mt = (i, e) => {
  const t = i.length - 1, n = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = F;
  for (let r = 0; r < t; r++) {
    const c = i[r];
    let u, p, l = -1, d = 0;
    for (; d < c.length && (a.lastIndex = d, p = a.exec(c), p !== null); ) d = a.lastIndex, a === F ? p[1] === "!--" ? a = we : p[1] !== void 0 ? a = xe : p[2] !== void 0 ? (We.test(p[2]) && (s = RegExp("</" + p[2], "g")), a = D) : p[3] !== void 0 && (a = D) : a === D ? p[0] === ">" ? (a = s ?? F, l = -1) : p[1] === void 0 ? l = -2 : (l = a.lastIndex - p[2].length, u = p[1], a = p[3] === void 0 ? D : p[3] === '"' ? Ae : Se) : a === Ae || a === Se ? a = D : a === we || a === xe ? a = F : (a = D, s = void 0);
    const g = a === D && i[r + 1].startsWith("/>") ? " " : "";
    o += a === F ? c + ht : l >= 0 ? (n.push(u), c.slice(0, l) + Pe + c.slice(l) + A + g) : c + A + (l === -2 ? r : g);
  }
  return [Re(i, o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class I {
  constructor({ strings: e, _$litType$: t }, n) {
    let s;
    this.parts = [];
    let o = 0, a = 0;
    const r = e.length - 1, c = this.parts, [u, p] = mt(e, t);
    if (this.el = I.createElement(u, n), C.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = C.nextNode()) !== null && c.length < r; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(Pe)) {
          const d = p[a++], g = s.getAttribute(l).split(A), m = /([.?@])?(.*)/.exec(d);
          c.push({ type: 1, index: o, name: m[2], strings: g, ctor: m[1] === "." ? ft : m[1] === "?" ? bt : m[1] === "@" ? vt : X }), s.removeAttribute(l);
        } else l.startsWith(A) && (c.push({ type: 6, index: o }), s.removeAttribute(l));
        if (We.test(s.tagName)) {
          const l = s.textContent.split(A), d = l.length - 1;
          if (d > 0) {
            s.textContent = q ? q.emptyScript : "";
            for (let g = 0; g < d; g++) s.append(l[g], H()), C.nextNode(), c.push({ type: 2, index: ++o });
            s.append(l[d], H());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Oe) c.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(A, l + 1)) !== -1; ) c.push({ type: 7, index: o }), l += A.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const n = M.createElement("template");
    return n.innerHTML = e, n;
  }
}
function W(i, e, t = i, n) {
  if (e === O) return e;
  let s = n !== void 0 ? t._$Co?.[n] : t._$Cl;
  const o = j(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(i), s._$AT(i, t, n)), n !== void 0 ? (t._$Co ??= [])[n] = s : t._$Cl = s), s !== void 0 && (e = W(i, s._$AS(i, e.values), s, n)), e;
}
class yt {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: n } = this._$AD, s = (e?.creationScope ?? M).importNode(t, !0);
    C.currentNode = s;
    let o = C.nextNode(), a = 0, r = 0, c = n[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let u;
        c.type === 2 ? u = new K(o, o.nextSibling, this, e) : c.type === 1 ? u = new c.ctor(o, c.name, c.strings, this, e) : c.type === 6 && (u = new $t(o, this, e)), this._$AV.push(u), c = n[++r];
      }
      a !== c?.index && (o = C.nextNode(), a++);
    }
    return C.currentNode = M, s;
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), t += n.strings.length - 2) : n._$AI(e[t])), t++;
  }
}
class K {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, n, s) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = W(this, e, t), j(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : _t(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && j(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: n } = e, s = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = I.createElement(Re(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const o = new yt(s, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ke.get(e.strings);
    return t === void 0 && ke.set(e.strings, t = new I(e)), t;
  }
  k(e) {
    re(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, s = 0;
    for (const o of e) s === t.length ? t.push(n = new K(this.O(H()), this.O(H()), this, this.options)) : n = t[s], n._$AI(o), s++;
    s < t.length && (this._$AR(n && n._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const n = ve(e).nextSibling;
      ve(e).remove(), e = n;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, s, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = o, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = h;
  }
  _$AI(e, t = this, n, s) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) e = W(this, e, t, 0), a = !j(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
    else {
      const r = e;
      let c, u;
      for (e = o[0], c = 0; c < o.length - 1; c++) u = W(this, r[n + c], t, c), u === O && (u = this._$AH[c]), a ||= !j(u) || u !== this._$AH[c], u === h ? e = h : e !== h && (e += (u ?? "") + o[c + 1]), this._$AH[c] = u;
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ft extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class bt extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class vt extends X {
  constructor(e, t, n, s, o) {
    super(e, t, n, s, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = W(this, e, t, 0) ?? h) === O) return;
    const n = this._$AH, s = e === h && n !== h || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, o = e !== h && (n === h || s);
    s && this.element.removeEventListener(this.name, this, n), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class $t {
  constructor(e, t, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    W(this, e);
  }
}
const wt = ae.litHtmlPolyfillSupport;
wt?.(I, K), (ae.litHtmlVersions ??= []).push("3.3.3");
const xt = (i, e, t) => {
  const n = t?.renderBefore ?? e;
  let s = n._$litPart$;
  if (s === void 0) {
    const o = t?.renderBefore ?? null;
    n._$litPart$ = s = new K(e.insertBefore(H(), o), o, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
const ce = globalThis;
class P extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = xt(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return O;
  }
}
P._$litElement$ = !0, P.finalized = !0, ce.litElementHydrateSupport?.({ LitElement: P });
const St = ce.litElementPolyfillSupport;
St?.({ LitElement: P });
(ce.litElementVersions ??= []).push("4.2.2");
const At = {
  de: {
    title: "Amortisation der PV-Anlage",
    benefit: "Bisheriger Ertrag",
    progress: "Amortisation",
    own: "Eigenverbrauch",
    export: "Einspeisung",
    expected: "Voraussichtlich amortisiert",
    noProjection: "Eine Prognose benötigt einen positiven Ertrag.",
    unavailable: "Es liegen noch keine gültigen Energiewerte vor.",
    unsupportedUnit: "Erwartet wird Wh, kWh oder MWh",
    entityUnavailable: "nicht verfügbar",
    cached: "Letzter gültiger Datenstand",
    counterRegression: "Zählerstand ist niedriger als der zuletzt gültige Wert. Gespeicherter Wert wird weiter verwendet.",
    invalid: "Ungültige Konfiguration",
    warningTitle: "Warnung",
    scenariosTitle: "Amortisationsszenarien",
    scenariosOpen: "Amortisationsszenarien öffnen",
    scenarioLinear: "Nur linear",
    scenarioSeasonal: "Mit Saisonalität",
    scenarioDiscounted: "Mit Saisonalität und Abzinsung",
    discountRate: "Abzinsungssatz",
    defaultRate: "Standardwert",
    locationFallback: "Der Home-Assistant-Standort fehlt. Die saisonalen Szenarien verwenden deshalb die lineare Prognose.",
    close: "Schließen"
  },
  en: {
    title: "Solar payback",
    benefit: "Benefit to date",
    progress: "Payback",
    own: "Self-consumption",
    export: "Export",
    expected: "Estimated payback",
    noProjection: "A positive benefit is required for a projection.",
    unavailable: "No valid energy values are available yet.",
    unsupportedUnit: "Expected Wh, kWh, or MWh",
    entityUnavailable: "unavailable",
    cached: "Last valid data",
    counterRegression: "Counter value is lower than the last valid value. The saved value remains in use.",
    invalid: "Invalid configuration",
    warningTitle: "Warning",
    scenariosTitle: "Payback scenarios",
    scenariosOpen: "Open payback scenarios",
    scenarioLinear: "Linear only",
    scenarioSeasonal: "With seasonality",
    scenarioDiscounted: "With seasonality and discounting",
    discountRate: "Discount rate",
    defaultRate: "default",
    locationFallback: "The Home Assistant location is unavailable. The seasonal scenarios therefore use the linear forecast.",
    close: "Close"
  }
}, kt = {
  de: {
    advanced_settings: "Erweiterte Einstellungen",
    advanced_settings_description: "Optionale Einstellungen für direkten Eigenverbrauch, Darstellung, Saisonalität und Abzinsung.",
    display_style: "Darstellung",
    display_style_full: "Vollständig",
    display_style_compact: "Kompakt",
    start_date: "Startdatum",
    investment_cost: "Investitionskosten",
    electricity_price: "Strompreis pro kWh",
    feed_in_tariff: "Einspeisevergütung pro kWh",
    self_consumption_entity: "Entität für Eigenverbrauch",
    export_energy_entity: "Entität für Einspeisung",
    production_energy_entity: "Entität für PV-Produktion",
    self_consumption_baseline: "Ausgangswert Eigenverbrauch (kWh)",
    production_energy_baseline: "Ausgangswert PV-Produktion (kWh)",
    export_energy_baseline: "Ausgangswert Einspeisung (kWh)",
    show_breakdown: "Aufschlüsselung anzeigen",
    show_energy_values: "Energiewerte anzeigen",
    show_money_values: "Geldwerte anzeigen",
    show_payback_date: "Amortisationsdatum anzeigen",
    show_progress: "Fortschritt anzeigen",
    show_contribution_segments: "Anteile im Fortschrittsbalken getrennt anzeigen",
    use_location_seasonality: "Saisonale Prognose vom Home-Assistant-Standort verwenden",
    annual_discount_rate: "Jährlicher Abzinsungssatz in Prozent",
    apply_annual_discount: "Jährliche Abzinsung anwenden"
  },
  en: {
    advanced_settings: "Advanced settings",
    advanced_settings_description: "Optional settings for direct self-consumption, display, seasonality, and discounting.",
    display_style: "Display style",
    display_style_full: "Full",
    display_style_compact: "Compact",
    start_date: "Start date",
    investment_cost: "Investment cost",
    electricity_price: "Electricity price per kWh",
    feed_in_tariff: "Feed-in tariff per kWh",
    self_consumption_entity: "Self-consumption energy entity",
    export_energy_entity: "Export energy entity",
    production_energy_entity: "PV production energy entity",
    self_consumption_baseline: "Self-consumption baseline (kWh)",
    production_energy_baseline: "PV production baseline (kWh)",
    export_energy_baseline: "Export baseline (kWh)",
    show_breakdown: "Show breakdown",
    show_energy_values: "Show energy values",
    show_money_values: "Show monetary values",
    show_payback_date: "Show payback date",
    show_progress: "Show progress",
    show_contribution_segments: "Show separate contribution segments in progress bar",
    use_location_seasonality: "Use seasonal forecast from the Home Assistant location",
    annual_discount_rate: "Annual discount rate in percent",
    apply_annual_discount: "Apply annual discounting"
  }
}, Et = Te`
  label {
    display: block;
    margin: 10px 0;
  }
  input,
  select {
    box-sizing: border-box;
    display: block;
    width: 100%;
    min-height: 44px;
    padding: 8px;
  }
  label:has(input[type="checkbox"]) {
    display: flex;
    min-height: 44px;
    align-items: center;
  }
  label:has(input[type="checkbox"]) input {
    display: inline;
    width: 20px;
    min-height: 20px;
    margin-inline-end: 8px;
  }
  .advanced-toggle {
    display: flex;
    width: 100%;
    min-height: 44px;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding: 8px 0;
    border: 0;
    background: transparent;
    color: var(--primary-color);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .advanced-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  .advanced-settings {
    padding-top: 4px;
    border-top: 1px solid var(--divider-color);
  }
  .advanced-settings p {
    margin: 8px 0 12px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
`, Dt = Te`
  .scenario-trigger {
    padding: 0;
    border: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    font: inherit;
    font-weight: inherit;
    border-radius: 4px;
    cursor: pointer;
  }
  .scenario-trigger:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
  }
  :host {
    display: block;
  }
  .content {
    padding: 16px;
    color: var(--primary-text-color);
  }
  .content.compact {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 16px;
  }
  .compact .header {
    grid-row: 1;
    grid-column: 1 / -1;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.1em;
    font-weight: 600;
  }
  .header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .header-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-progress {
    color: var(--primary-color);
    font-size: 1.545em;
    white-space: nowrap;
  }
  ha-icon {
    color: var(--primary-color);
  }
  .warning-indicator {
    display: inline-flex;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--warning-color, #ff9800);
    cursor: pointer;
    font: inherit;
  }
  .warning-indicator ha-icon {
    color: inherit;
  }
  .warning-indicator:focus-visible {
    outline: 2px solid var(--warning-color, #ff9800);
    outline-offset: 3px;
    border-radius: 4px;
  }
  .benefit {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 22px 0 12px;
  }
  .benefit strong {
    font-size: 1.7em;
  }
  .compact .benefit {
    grid-row: 2;
    grid-column: 1;
    justify-content: flex-start;
    min-width: 0;
    margin: 16px 0 10px;
  }
  .compact .benefit strong {
    max-width: 100%;
    overflow: hidden;
    font-size: 1.15em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .compact .benefit span,
  .compact .date span,
  .compact .breakdown span {
    display: none;
  }
  .date {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 12px;
    margin: 18px 0 6px;
  }
  .progress-trigger {
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: help;
  }
  .progress-trigger:focus-visible {
    outline: none;
  }
  .bar {
    display: flex;
    width: 100%;
    height: 10px;
    background: var(--secondary-background-color);
    border-radius: 99px;
    overflow: hidden;
  }
  .compact .progress-trigger {
    grid-row: 3;
    grid-column: 1 / -1;
  }
  .progress-trigger:focus-visible .bar {
    outline: 2px solid var(--primary-color);
    outline-offset: 3px;
  }
  .bar > span {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--info-color, #03a9f4) 0%,
      var(--success-color, #4caf50) 100%
    );
    border-radius: inherit;
    transition: width 0.2s;
  }
  .bar.contribution-segments {
    display: flex;
  }
  .bar.contribution-segments > span {
    flex-shrink: 0;
    border-radius: 0;
  }
  .bar.contribution-segments .contribution-own {
    background: var(--info-color, #03a9f4);
    border-radius: 99px 0 0 99px;
  }
  .bar.contribution-segments .contribution-export {
    background: var(--success-color, #4caf50);
    border-radius: 0 99px 99px 0;
  }
  .progress-tooltip {
    position: absolute;
    z-index: 2;
    bottom: calc(100% + 10px);
    inset-inline-start: 50%;
    display: grid;
    width: max-content;
    max-width: min(320px, calc(100vw - 48px));
    gap: 6px;
    padding: 10px 12px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    box-shadow: 0 3px 10px rgb(0 0 0 / 24%);
    border-radius: 8px;
    opacity: 0;
    pointer-events: none;
    text-align: start;
    transform: translateX(-50%) translateY(4px);
    transition:
      opacity 0.15s ease,
      transform 0.15s ease,
      visibility 0.15s ease;
    visibility: hidden;
  }
  .progress-tooltip::after {
    position: absolute;
    top: 100%;
    inset-inline-start: 50%;
    width: 8px;
    height: 8px;
    border-inline-end: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    content: "";
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .progress-trigger:hover .progress-tooltip,
  .progress-trigger:focus-visible .progress-tooltip,
  .progress-trigger.tooltip-open .progress-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    visibility: visible;
  }
  .tooltip-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 18px;
    white-space: nowrap;
  }
  .tooltip-row.tooltip-own {
    color: var(--info-color, #03a9f4);
  }
  .tooltip-row.tooltip-export {
    color: var(--success-color, #4caf50);
  }
  .breakdown {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 18px;
  }
  .compact .breakdown {
    grid-row: 4;
    grid-column: 1 / -1;
    margin-top: 12px;
  }
  .compact .breakdown b {
    display: block;
    overflow: hidden;
    font-size: 0.82em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .breakdown div,
  .breakdown-action {
    display: grid;
    gap: 4px;
  }
  .breakdown span,
  .date span,
  .benefit span {
    color: var(--secondary-text-color);
  }
  .breakdown b {
    font-size: 0.92em;
  }
  .breakdown-action {
    padding: 0;
    border: 0;
    appearance: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
  }
  .breakdown-action:not(:disabled) {
    cursor: pointer;
  }
  .breakdown-action:not(:disabled):focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
    border-radius: 4px;
  }
  .breakdown.contribution-segments .own,
  .breakdown.contribution-segments .own span,
  .breakdown.contribution-segments .own b {
    color: var(--info-color, #03a9f4);
  }
  .breakdown.contribution-segments .export,
  .breakdown.contribution-segments .export span,
  .breakdown.contribution-segments .export b {
    color: var(--success-color, #4caf50);
  }
  .date b,
  .date .scenario-trigger {
    text-align: end;
  }
  .compact .date {
    grid-row: 2;
    grid-column: 2;
    align-items: baseline;
    justify-content: flex-end;
    min-width: 0;
    margin: 16px 0 10px;
  }
  .compact .date b,
  .compact .date .scenario-trigger {
    max-width: 100%;
    overflow: hidden;
    font-size: 1.15em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status-only {
    min-height: 24px;
  }
  .warning-dialog-message {
    max-width: 520px;
    white-space: pre-wrap;
  }
  .scenario-dialog {
    display: grid;
    gap: 12px;
    min-width: min(520px, 75vw);
    padding-bottom: 8px;
  }
  .scenario {
    --scenario-color: var(--secondary-text-color, #727272);
    padding: 14px;
    border: 2px solid var(--scenario-color);
    background: var(--secondary-background-color);
    background: color-mix(in srgb, var(--scenario-color) 12%, var(--card-background-color, #fff));
    border-radius: 12px;
  }
  .scenario-seasonal {
    --scenario-color: var(--success-color, #4caf50);
  }
  .scenario-discounted {
    --scenario-color: var(--info-color, #03a9f4);
  }
  .scenario-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .scenario-heading ha-icon {
    color: var(--scenario-color);
  }
  .scenario h3 {
    margin: 0;
    font-size: 1em;
  }
  .scenario-rate,
  .scenario-values span {
    color: var(--secondary-text-color);
  }
  .scenario-warning {
    display: flex;
    justify-content: flex-end;
  }
  .scenario-rate {
    margin: -4px 0 10px;
    font-size: 0.88em;
  }
  .scenario-values {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .scenario-values div {
    display: grid;
    gap: 4px;
  }
  .scenario-values strong:last-child {
    text-align: end;
  }
  @media (max-width: 360px) {
    .breakdown {
      grid-template-columns: 1fr;
    }
    .date,
    .benefit {
      align-items: start;
      flex-direction: column;
      gap: 4px;
    }
    .date b,
    .date .scenario-trigger {
      text-align: start;
    }
    .content.compact .breakdown {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .content.compact .date,
    .content.compact .benefit {
      align-items: baseline;
      flex-direction: row;
      gap: 0;
    }
    .content.compact .date b,
    .content.compact .date .scenario-trigger {
      text-align: end;
    }
    .scenario-dialog {
      min-width: 0;
    }
    .scenario-values {
      grid-template-columns: 1fr;
    }
    .scenario-values strong:last-child {
      text-align: start;
    }
  }
`, Ee = 180 * 1e3;
class Ct extends P {
  static properties = {
    hass: { attribute: !1 },
    _config: { state: !0 },
    _scenarioDialogOpen: { state: !0 },
    _contributionTooltipOpen: { state: !0 },
    _warningDialogMessage: { state: !0 }
  };
  constructor() {
    super(), this._scenarioDialogOpen = !1, this._contributionTooltipOpen = !1;
  }
  static getStubConfig() {
    return {
      type: "custom:pv-payback-card",
      display_style: "full",
      show_breakdown: !0,
      show_energy_values: !0,
      show_money_values: !0,
      show_payback_date: !0,
      show_progress: !0,
      show_contribution_segments: !1,
      use_location_seasonality: !1,
      annual_discount_rate: 0,
      apply_annual_discount: !1
    };
  }
  static getConfigElement() {
    return document.createElement("pv-payback-card-editor");
  }
  setConfig(e) {
    nt(e), this._comparisonDiscountRate = e.annual_discount_rate ?? 3, this._comparisonUsesDefaultRate = e.annual_discount_rate === void 0, this._config = je(e), this._contributionTooltipOpen = !1, this._historicalStatistics = void 0, this._historicalStatisticsKey = void 0, this._historyRecoveryKey = void 0, this._calculationCache = void 0, this._scenarioCalculationCache = void 0, this.resetWarningDelay();
  }
  _historicalStatistics;
  _historicalStatisticsKey;
  _historyRecoveryKey;
  _calculationCache;
  _scenarioCalculationCache;
  _comparisonDiscountRate = 3;
  _comparisonUsesDefaultRate = !0;
  _warningStartedAt = /* @__PURE__ */ new Map();
  _warningTimer;
  _pendingEnergyCacheWrites = /* @__PURE__ */ new Map();
  disconnectedCallback() {
    super.disconnectedCallback(), this.resetWarningDelay();
  }
  shouldUpdate(e) {
    if ([...e.keys()].some((a) => a !== "hass") || !e.has("hass")) return !0;
    const t = e.get("hass"), n = this.hass, s = this._config;
    return !s || !t || !n || t.locale?.language !== n.locale?.language || t.config?.currency !== n.config?.currency || t.config?.latitude !== n.config?.latitude || t.config?.longitude !== n.config?.longitude ? !0 : [
      s.self_consumption_entity ?? s.production_energy_entity,
      s.export_energy_entity
    ].filter((a) => !!a).some((a) => {
      const r = t.states[a], c = n.states[a];
      return r?.state !== c?.state || r?.last_updated !== c?.last_updated || r?.attributes?.unit_of_measurement !== c?.attributes?.unit_of_measurement;
    });
  }
  resetWarningDelay() {
    this._warningStartedAt.clear(), this._warningTimer !== void 0 && clearTimeout(this._warningTimer), this._warningTimer = void 0;
  }
  persistentWarningReadings(e) {
    const t = Date.now(), n = e.filter(
      (r) => r.issueKey !== void 0
    ), s = new Set(n.map((r) => r.issueKey));
    for (const r of this._warningStartedAt.keys())
      s.has(r) || this._warningStartedAt.delete(r);
    for (const r of n)
      this._warningStartedAt.has(r.issueKey) || this._warningStartedAt.set(r.issueKey, t);
    const o = n.filter(
      (r) => t - this._warningStartedAt.get(r.issueKey) >= Ee
    ), a = n.map((r) => Ee - (t - this._warningStartedAt.get(r.issueKey))).filter((r) => r > 0);
    return this._warningTimer !== void 0 && clearTimeout(this._warningTimer), this._warningTimer = void 0, a.length > 0 && (this._warningTimer = setTimeout(
      () => {
        this._warningTimer = void 0, this.requestUpdate();
      },
      Math.min(...a)
    )), o;
  }
  updated() {
    this.flushPendingEnergyCacheWrites();
    const e = this._config;
    if (!(!e || !this.hass?.callWS)) {
      if (ie(e) && (e.annual_discount_rate ?? 0) > 0) {
        const t = x(/* @__PURE__ */ new Date());
        t.setDate(t.getDate() - 1);
        const n = Ce(e, k(t));
        this._historicalStatisticsKey !== n && (this._historicalStatisticsKey = n, Le(this.hass, e)?.then((s) => {
          s && this._historicalStatisticsKey === n && (this._historicalStatistics = s, this.requestUpdate());
        }));
      }
      this.recoverMissingEnergyFromHistory(e);
    }
  }
  flushPendingEnergyCacheWrites() {
    for (const [e, t] of this._pendingEnergyCacheWrites)
      try {
        localStorage.setItem(e, JSON.stringify(t));
      } catch {
      }
    this._pendingEnergyCacheWrites.clear();
  }
  recoverMissingEnergyFromHistory(e) {
    if (!this.hass?.callWS) return;
    const t = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity].filter(
      (o) => !!o
    ), n = {};
    for (const o of t) {
      const a = this.hass.states[o], r = a?.attributes?.unit_of_measurement;
      if (!V(r)) continue;
      const c = Number(a.state), u = te(c, r), p = ge(localStorage, U(e, o));
      u === void 0 && p === void 0 && (n[o] = r);
    }
    const s = JSON.stringify(
      Object.keys(n).sort().map((o) => U(e, o))
    );
    Object.keys(n).length === 0 || this._historyRecoveryKey === s || (this._historyRecoveryKey = s, Ze(this.hass, n)?.then((o) => {
      if (this._historyRecoveryKey === s) {
        for (const [a, r] of Object.entries(o))
          try {
            localStorage.setItem(U(e, a), JSON.stringify(r));
          } catch {
          }
        Object.keys(o).length > 0 && this.requestUpdate();
      }
    }));
  }
  getCardSize() {
    const e = this._config;
    if (!e) return 1;
    const t = Number(e.show_progress) + Number(e.show_breakdown && (e.show_energy_values || e.show_money_values)) + Number(e.show_payback_date);
    return e.display_style === "compact" ? t > 1 ? 2 : 1 : Math.max(1, 1 + t);
  }
  getGridOptions() {
    const e = this._config?.display_style === "compact";
    return {
      columns: e ? 6 : 12,
      rows: this.getCardSize(),
      min_columns: e ? 6 : 9,
      min_rows: 1
    };
  }
  readEnergy(e, t, n) {
    const s = this.hass?.states[t], o = s ? Number(s.state) : Number.NaN, a = te(o, s?.attributes?.unit_of_measurement), r = ge(localStorage, U(e, t)), c = et(a, r), u = s?.attributes?.unit_of_measurement, p = s && !V(u) ? n.unsupportedUnit : n.entityUnavailable;
    if (c.value !== void 0) {
      if (!c.cached) {
        const l = {
          value: c.value,
          timestamp: s?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        };
        (r?.value !== l.value || r.timestamp !== l.timestamp) && this._pendingEnergyCacheWrites.set(U(e, t), l);
      }
      return {
        value: c.value,
        cached: c.cached,
        timestamp: c.cached ? r?.timestamp : s?.last_updated,
        warning: c.regression ? `${t}: ${n.counterRegression}` : c.cached ? `${t}: ${p}` : void 0,
        issueKey: c.cached ? `${t}:${c.regression ? "regression" : "unavailable"}` : void 0
      };
    }
    return {
      cached: !1,
      issueKey: `${t}:${s && !V(u) ? "unsupported-unit" : "unavailable"}`,
      warning: s && !V(u) ? `${t}: ${n.unsupportedUnit}` : `${t}: ${n.entityUnavailable}`
    };
  }
  text() {
    return At[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
  }
  formatMoney(e, t = 0) {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      style: "currency",
      currency: this._config?.currency ?? this.hass?.config?.currency ?? "EUR",
      maximumFractionDigits: t
    }).format(e);
  }
  formatEnergy(e) {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      maximumFractionDigits: 0
    }).format(e) + " kWh";
  }
  formatDate(e) {
    return e ? new Intl.DateTimeFormat(this._config?.locale ?? this.hass?.locale?.language, {
      dateStyle: "medium"
    }).format(e) : "—";
  }
  formatPercentage(e) {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      style: "percent",
      maximumFractionDigits: 2
    }).format(e / 100);
  }
  openScenarioDialog() {
    this._scenarioDialogOpen = !0;
  }
  closeScenarioDialog() {
    this._scenarioDialogOpen = !1;
  }
  toggleContributionTooltip() {
    this._contributionTooltipOpen = !this._contributionTooltipOpen;
  }
  closeContributionTooltip() {
    this._contributionTooltipOpen = !1;
  }
  handleContributionTooltipKeydown(e) {
    e.key === "Escape" && (this.closeContributionTooltip(), e.currentTarget.blur());
  }
  renderScenarioDialog(e, t) {
    const n = this.text(), s = [
      {
        name: n.scenarioLinear,
        scenario: e.linear,
        icon: "mdi:chart-line",
        className: "scenario-linear"
      },
      {
        name: n.scenarioSeasonal,
        scenario: e.seasonal,
        icon: "mdi:weather-sunny",
        className: "scenario-seasonal"
      },
      {
        name: n.scenarioDiscounted,
        scenario: e.discounted,
        icon: "mdi:percent-circle-outline",
        className: "scenario-discounted"
      }
    ], o = [
      t ? void 0 : n.locationFallback,
      s.some(({ scenario: a }) => !a.paybackDate) ? n.noProjection : void 0
    ].filter((a) => a !== void 0);
    return y`<ha-dialog
      .open=${this._scenarioDialogOpen}
      .heading=${n.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${o.length > 0 ? y`<div class="scenario-warning">
                ${this.renderWarningIndicator(o.join(`
`))}
              </div>` : h}
        ${s.map(
      ({ name: a, scenario: r, icon: c, className: u }, p) => y`<section class=${`scenario ${u}`}>
              <div class="scenario-heading">
                <ha-icon .icon=${c}></ha-icon>
                <h3>${a}</h3>
              </div>
              ${p === 2 ? y`<div class="scenario-rate">
                      ${n.discountRate}: ${this.formatPercentage(this._comparisonDiscountRate)}
                      ${this._comparisonUsesDefaultRate ? y`(${n.defaultRate})` : h}
                    </div>` : h}
              <div class="scenario-values">
                <div>
                  <span>${n.benefit}</span><strong>${this.formatMoney(r.benefit, 2)}</strong>
                </div>
                <div>
                  <span>${n.expected}</span
                  ><strong>${this.formatDate(r.paybackDate)}</strong>
                </div>
              </div>
            </section>`
    )}
      </div>
      <ha-button slot="primaryAction" @click=${this.closeScenarioDialog}>${n.close}</ha-button>
    </ha-dialog>`;
  }
  renderWarningIndicator(e) {
    return y`<button
      class="warning-indicator"
      type="button"
      aria-label=${e}
      title=${e}
      @click=${() => {
      this._warningDialogMessage = e;
    }}
    >
      <ha-icon icon="mdi:alert"></ha-icon>
    </button>`;
  }
  closeWarningDialog() {
    this._warningDialogMessage = void 0;
  }
  renderWarningDialog() {
    if (!this._warningDialogMessage) return h;
    const e = this.text();
    return y`<ha-dialog
      .open=${!0}
      .heading=${e.warningTitle}
      @closed=${this.closeWarningDialog}
    >
      <div class="warning-dialog-message">${this._warningDialogMessage}</div>
      <ha-button slot="primaryAction" @click=${this.closeWarningDialog}>${e.close}</ha-button>
    </ha-dialog>`;
  }
  renderStatusCard(e) {
    const t = this._config, n = this.text();
    return y`<ha-card>
        <div class="content status-only">
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${t.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${he(t.name, n.title)}</span>
            </div>
            <div class="header-meta">
              ${e ? this.renderWarningIndicator(e) : h}
            </div>
          </div>
        </div>
      </ha-card>
      ${this.renderWarningDialog()}`;
  }
  openMoreInfo(e) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    const e = this._config;
    if (!e) return h;
    const t = this.text(), n = tt(e);
    if (n) {
      const b = this.persistentWarningReadings([
        {
          cached: !1,
          issueKey: `configuration:${n}`,
          warning: `${t.invalid}: ${n}`
        }
      ]);
      return this.renderStatusCard(b[0]?.warning);
    }
    const s = e.self_consumption_entity ? this.readEnergy(e, e.self_consumption_entity, t) : void 0, o = !s && e.production_energy_entity ? this.readEnergy(e, e.production_energy_entity, t) : void 0, a = this.readEnergy(e, e.export_energy_entity, t), r = [s, o, a].filter(
      (b) => !!b
    );
    let c = this.persistentWarningReadings(r);
    const u = s?.value, p = o?.value, l = a.value;
    if (l === void 0 || s !== void 0 && u === void 0 || o !== void 0 && p === void 0) {
      const b = c.length > 0 ? `${t.unavailable}${c.filter((G) => G.warning).map((G) => ` ${G.warning}`).join("")}` : void 0;
      return this.renderStatusCard(b);
    }
    const d = u ?? p, g = /* @__PURE__ */ new Date(), m = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude
    }, $ = this._historicalStatistics ? `loaded:${this._historicalStatisticsKey ?? ""}` : `approximation:${this._historicalStatisticsKey ?? ""}`, f = JSON.stringify([
      e,
      d,
      l,
      k(g),
      m,
      $
    ]);
    this._calculationCache?.key !== f && (this._calculationCache = {
      key: f,
      calculation: B(
        e,
        d,
        l,
        g,
        m,
        _e(e, this._historicalStatistics)
      )
    });
    const _ = this._calculationCache.calculation, S = e.show_payback_date && !_.paybackDate ? {
      cached: !1,
      issueKey: "projection:no-positive-benefit",
      warning: t.noProjection
    } : void 0;
    c = this.persistentWarningReadings([
      ...r,
      ...S ? [S] : []
    ]);
    let w;
    if (this._scenarioDialogOpen) {
      const b = `${f}:${this._comparisonDiscountRate}`;
      this._scenarioCalculationCache?.key !== b && (this._scenarioCalculationCache = {
        key: b,
        scenarios: Xe(
          e,
          d,
          l,
          g,
          m,
          _e(e, this._historicalStatistics),
          this._comparisonDiscountRate
        )
      }), w = this._scenarioCalculationCache.scenarios;
    }
    const v = c.filter(
      (b) => b.issueKey !== "projection:no-positive-benefit"
    ), E = v.map((b) => b.timestamp).filter(Boolean).sort().at(0), Ue = v.length > 0 ? `${t.cached}${E ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(E))}` : ""}${v.filter((b) => b.warning).map((b) => ` ${b.warning}`).join("")}` : void 0, Fe = c.some(
      (b) => b.issueKey === "projection:no-positive-benefit"
    ) ? t.noProjection : void 0, le = [Ue, Fe].filter((b) => !!b).join(`
`), ue = Math.min(
      100,
      Math.max(0, _.ownValue / e.investment_cost * 100)
    ), Ve = Math.min(
      Math.max(0, 100 - ue),
      Math.max(0, _.exportValue / e.investment_cost * 100)
    ), ze = _.benefit > 0 ? _.ownValue / _.benefit * 100 : 0, He = _.benefit > 0 ? _.exportValue / _.benefit * 100 : 0, R = e.display_style === "compact";
    return y`<ha-card>
        <div class=${`content ${R ? "compact" : "full"}`}>
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${he(e.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${le ? this.renderWarningIndicator(le) : h}
              ${e.show_progress ? y`<span class="header-progress">${_.progress.toFixed(1)}%</span>` : h}
            </div>
          </div>
          <div class="benefit" title=${R ? t.benefit : h}>
            <span>${t.benefit}</span
            ><button
              type="button"
              class="scenario-trigger"
              aria-label=${`${t.scenariosOpen}: ${t.benefit}`}
              @click=${this.openScenarioDialog}
            >
              ${this.formatMoney(_.benefit)}
            </button>
          </div>
          ${e.show_progress ? y`<button
                  class=${`progress-trigger ${this._contributionTooltipOpen ? "tooltip-open" : ""}`}
                  type="button"
                  aria-label=${`${t.progress}: ${this.formatPercentage(_.progress)}`}
                  aria-describedby="contribution-tooltip"
                  @click=${this.toggleContributionTooltip}
                  @blur=${this.closeContributionTooltip}
                  @keydown=${this.handleContributionTooltipKeydown}
                >
                  <span
                    class="bar ${e.show_contribution_segments ? "contribution-segments" : ""}"
                    role="progressbar"
                    aria-label=${t.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow=${_.progress}
                  >
                    ${e.show_contribution_segments ? y`<span
                              class="contribution-own"
                              style=${`width:${ue}%`}
                            ></span>
                            <span
                              class="contribution-export"
                              style=${`width:${Ve}%`}
                            ></span>` : y`<span style=${`width:${_.progress}%`}></span>`}
                  </span>
                  <span id="contribution-tooltip" class="progress-tooltip" role="tooltip">
                    <span class="tooltip-row tooltip-own">
                      <span>${t.own}</span>
                      <strong
                        >${this.formatPercentage(ze)} ·
                        ${this.formatMoney(_.ownValue)}</strong
                      >
                    </span>
                    <span class="tooltip-row tooltip-export">
                      <span>${t.export}</span>
                      <strong
                        >${this.formatPercentage(He)} ·
                        ${this.formatMoney(_.exportValue)}</strong
                      >
                    </span>
                  </span>
                </button>` : h}
          ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? y`<div
                  class="breakdown ${e.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <button
                    class="own breakdown-action"
                    type="button"
                    ?disabled=${!e.self_consumption_entity}
                    aria-label=${t.own}
                    title=${R ? t.own : h}
                    @click=${() => e.self_consumption_entity && this.openMoreInfo(e.self_consumption_entity)}
                  >
                    <span>${t.own}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(_.selfConsumption)} · ${this.formatMoney(_.ownValue)}` : e.show_energy_values ? this.formatEnergy(_.selfConsumption) : this.formatMoney(_.ownValue)}</b
                    >
                  </button>
                  <button
                    class="export breakdown-action"
                    type="button"
                    aria-label=${t.export}
                    title=${R ? t.export : h}
                    @click=${() => this.openMoreInfo(e.export_energy_entity)}
                  >
                    <span>${t.export}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(_.exported)} · ${this.formatMoney(_.exportValue)}` : e.show_energy_values ? this.formatEnergy(_.exported) : this.formatMoney(_.exportValue)}</b
                    >
                  </button>
                </div>` : h}
          ${e.show_payback_date ? y`<div class="date" title=${R ? t.expected : h}>
                  <span>${t.expected}</span
                  ><button
                    type="button"
                    class="scenario-trigger"
                    aria-label=${`${t.scenariosOpen}: ${t.expected}`}
                    @click=${this.openScenarioDialog}
                  >
                    ${this.formatDate(_.paybackDate)}
                  </button>
                </div>` : h}
        </div>
      </ha-card>
      ${this._scenarioDialogOpen && w ? this.renderScenarioDialog(
      w,
      Y(m.latitude, m.longitude)
    ) : h}
      ${this.renderWarningDialog()}`;
  }
  static styles = Dt;
}
customElements.define("pv-payback-card", Ct);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "Solar Payback Card",
  description: "Displays solar financial payback from cumulative energy sensors."
});
class Mt extends P {
  static properties = {
    hass: { attribute: !1 },
    _config: { state: !0 },
    _advancedOpen: { state: !0 }
  };
  constructor() {
    super(), this._config = {}, this._advancedOpen = !1;
  }
  setConfig(e) {
    this._config = { ...e }, (e.self_consumption_entity || e.self_consumption_baseline !== void 0 || e.use_location_seasonality === !0 || e.apply_annual_discount === !0 || e.use_historical_statistics === !0 || (e.annual_discount_rate ?? 0) !== 0 || e.show_breakdown === !1 || e.show_energy_values === !1 || e.show_money_values === !1 || e.show_payback_date === !1 || e.show_progress === !1) && (this._advancedOpen = !0);
  }
  toggleAdvanced() {
    this._advancedOpen = !this._advancedOpen;
  }
  changed(e) {
    const t = e.target, n = [
      "investment_cost",
      "electricity_price",
      "feed_in_tariff",
      "self_consumption_baseline",
      "production_energy_baseline",
      "export_energy_baseline",
      "annual_discount_rate"
    ].includes(t.name), s = { ...this._config };
    if (t.type === "checkbox")
      s[t.name] = t.checked;
    else if (n) {
      const o = t.value.trim();
      if (!o)
        delete s[t.name];
      else {
        const a = Number(o);
        if (!Number.isFinite(a)) return;
        s[t.name] = a;
      }
    } else
      s[t.name] = t.value;
    this._config = s, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityChanged(e, t) {
    const n = t.detail?.value, s = typeof n == "string" ? n.trim() : "", o = { ...this._config };
    s ? o[e] = s : delete o[e], this._config = o, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityField(e, t) {
    const n = String(this._config[e] ?? "");
    return this.hass && customElements.get("ha-entity-picker") ? y`<ha-entity-picker
        .hass=${this.hass}
        .value=${n}
        .label=${t}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${!0}
        @value-changed=${(o) => this.entityChanged(e, o)}
      ></ha-entity-picker>` : y`<label
      >${t}<input name=${e} type="text" .value=${n} @change=${this.changed}
    /></label>`;
  }
  render() {
    const e = kt[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
      ["start_date", e.start_date, "date"],
      ["investment_cost", e.investment_cost, "number"],
      ["electricity_price", e.electricity_price, "number"],
      ["feed_in_tariff", e.feed_in_tariff, "number"]
    ], n = [
      ["production_energy_baseline", e.production_energy_baseline, "number"],
      ["export_energy_baseline", e.export_energy_baseline, "number"]
    ], s = [
      ["self_consumption_baseline", e.self_consumption_baseline, "number"],
      ["annual_discount_rate", e.annual_discount_rate, "number"]
    ], o = ([r, c, u]) => y`<label
        >${c}<input
          name=${r}
          type=${u}
          step="any"
          .value=${String(this._config[r] ?? "")}
          @change=${this.changed}
      /></label>`, a = (r) => y`<label
        ><input
          name=${r}
          type="checkbox"
          .checked=${r === "show_contribution_segments" || r === "use_location_seasonality" || r === "apply_annual_discount" ? this._config[r] === !0 : this._config[r] !== !1}
          @change=${this.changed}
        />${e[r]}</label
      >`;
    return y`${t.map(
      o
    )}${this.entityField("production_energy_entity", e.production_energy_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${n.map(
      o
    )}<label
        >${e.display_style}<select
          name="display_style"
          .value=${this._config.display_style ?? "full"}
          @change=${this.changed}
        >
          <option value="full">${e.display_style_full}</option>
          <option value="compact">${e.display_style_compact}</option>
        </select></label
      >${a("show_contribution_segments")}
      <button
        class="advanced-toggle"
        type="button"
        aria-expanded=${this._advancedOpen ? "true" : "false"}
        @click=${this.toggleAdvanced}
      >
        <span>${e.advanced_settings}</span>
        <ha-icon icon=${this._advancedOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
      ${this._advancedOpen ? y`<section class="advanced-settings">
              <p>${e.advanced_settings_description}</p>
              ${this.entityField("self_consumption_entity", e.self_consumption_entity)}
              ${s.map(o)} ${a("show_breakdown")}
              ${a("show_energy_values")} ${a("show_money_values")}
              ${a("show_payback_date")} ${a("show_progress")}
              ${a("use_location_seasonality")} ${a("apply_annual_discount")}
            </section>` : h}`;
  }
  static styles = Et;
}
customElements.define("pv-payback-card-editor", Mt);
export {
  De as BoundedCache,
  Tt as MAXIMUM_FORECAST_DAYS,
  Ct as PVPaybackCard,
  Mt as PVPaybackCardEditor,
  ie as appliesAnnualDiscount,
  nt as assertConfigStructure,
  U as cacheKey,
  B as calculatePayback,
  Xe as calculateScenarioComparisons,
  Ke as calculateSeasonalPaybackDate,
  x as calendarDay,
  et as chooseEnergyValue,
  _e as dailyEnergyFromStatistics,
  k as dateKey,
  he as displayName,
  Ye as distributeHistoricalEnergy,
  te as energyToKwh,
  Ce as historicalStatisticsCacheKey,
  V as isUnit,
  Ge as latestValidEnergyFromHistory,
  Le as loadHistoricalStatistics,
  Ze as loadLastValidEnergyHistory,
  Qe as parseCachedEnergy,
  ge as readCachedEnergy,
  Q as statisticDailyDeltas,
  tt as validConfig,
  Y as validLocation,
  je as withDisplayDefaults
};
