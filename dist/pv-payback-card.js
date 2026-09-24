const Wt = 18300;
class Re extends Map {
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
      const i = this.keys().next().value;
      if (i === void 0) break;
      super.delete(i);
    }
    return this;
  }
}
const ve = new Re(), be = new Re();
function J(n) {
  return n === "Wh" || n === "kWh" || n === "MWh";
}
function ue(n, e) {
  if (!(!Number.isFinite(n) || !J(e)))
    return e === "Wh" ? n / 1e3 : e === "MWh" ? n * 1e3 : n;
}
function Be(n) {
  return {
    ...n,
    display_style: n.display_style ?? "full",
    payback_date_format: n.payback_date_format ?? "absolute",
    payback_date_relative_reference: n.payback_date_relative_reference ?? "now",
    show_breakdown: n.show_breakdown ?? !0,
    show_energy_values: n.show_energy_values ?? !0,
    show_money_values: n.show_money_values ?? !0,
    show_payback_date: n.show_payback_date ?? !0,
    show_progress: n.show_progress ?? !0,
    show_contribution_segments: n.show_contribution_segments ?? !1,
    use_location_seasonality: n.use_location_seasonality ?? !1,
    annual_discount_rate: n.annual_discount_rate ?? 0,
    apply_annual_discount: n.apply_annual_discount ?? n.use_historical_statistics ?? !1
  };
}
function he(n) {
  return n.apply_annual_discount ?? n.use_historical_statistics ?? !1;
}
function $e(n, e) {
  return !n || n === "PV-Amortisation" || n === "PV payback" ? e : n;
}
function Le(n, e, t, i) {
  if (t <= 0 || n > e) return;
  const s = Math.max(1, (e.getTime() - n.getTime()) / 864e5);
  return new Date(n.getTime() + i / t * s * 864e5);
}
function D(n) {
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
function Ye(n, e) {
  const t = D(n), i = D(e), s = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()), a = Date.UTC(i.getFullYear(), i.getMonth(), i.getDate());
  if (a < s) throw new RangeError("End date must not precede start date.");
  const o = (l) => {
    const c = new Date(Date.UTC(t.getFullYear(), t.getMonth() + l, 1)), u = c.getUTCFullYear(), d = c.getUTCMonth(), h = new Date(Date.UTC(u, d + 1, 0)).getUTCDate();
    return Date.UTC(u, d, Math.min(t.getDate(), h));
  };
  let r = (i.getFullYear() - t.getFullYear()) * 12 + i.getMonth() - t.getMonth();
  return o(r) > a && (r -= 1), {
    years: Math.floor(r / 12),
    months: r % 12,
    days: Math.round((a - o(r)) / 864e5)
  };
}
function F(n, e) {
  const t = new Date(n.getFullYear(), 0, 0), i = Math.round((D(n).getTime() - t.getTime()) / 864e5), s = e * Math.PI / 180, a = 0.409 * Math.sin(2 * Math.PI * i / 365 - 1.39), o = -Math.tan(s) * Math.tan(a), r = Math.acos(Math.max(-1, Math.min(1, o))), l = r * Math.sin(s) * Math.sin(a) + Math.cos(s) * Math.cos(a) * Math.sin(r);
  return Math.max(0, l);
}
function qe(n, e, t, i, s) {
  const a = /* @__PURE__ */ new Date(`${n}T00:00:00`);
  if (Number.isNaN(a.getTime()) || !Number.isFinite(e.getTime()) || !Number.isFinite(t) || t <= 0 || !Number.isFinite(i) || i <= 0 || !Number.isFinite(s) || s < -90 || s > 90 || a > e)
    return;
  const o = D(e);
  let r = 0;
  for (let h = D(a); h <= o; h.setDate(h.getDate() + 1))
    r += F(h, s);
  if (!Number.isFinite(r) || r <= 0) return;
  const l = t / r, c = Math.max(1e-9, i * Number.EPSILON * 16);
  if (t >= i) {
    let h = 0;
    for (let b = D(a); b <= o; b.setDate(b.getDate() + 1))
      if (h += F(b, s) * l, h >= i - c) return new Date(b);
    return;
  }
  let u = t;
  const d = new Date(o);
  for (let h = 0; h < 18300; h += 1) {
    if (u >= i - c) return new Date(d);
    d.setDate(d.getDate() + 1), u += F(d, s) * l;
  }
}
function ae(n, e) {
  return typeof n == "number" && Number.isFinite(n) && n >= -90 && n <= 90 && typeof e == "number" && Number.isFinite(e) && e >= -180 && e <= 180;
}
function M(n) {
  return [
    n.getFullYear(),
    String(n.getMonth() + 1).padStart(2, "0"),
    String(n.getDate()).padStart(2, "0")
  ].join("-");
}
function ce(n, e, t) {
  const i = Math.max(
    0,
    (D(n).getTime() - D(e).getTime()) / 864e5
  );
  return 1 / (1 + t / 100) ** (i / 365.2425);
}
function Je(n) {
  const e = n.start ?? n.start_time;
  if (typeof e == "number")
    return !Number.isFinite(e) || Number.isNaN(new Date(e).getTime()) ? void 0 : M(new Date(e));
  if (!(typeof e != "string" || Number.isNaN(new Date(e).getTime())))
    return e.slice(0, 10);
}
function te(n) {
  const e = /* @__PURE__ */ new Map();
  let t;
  for (const i of n ?? []) {
    const s = Je(i), a = typeof i.sum == "number" ? i.sum : Number.NaN;
    if (!s || !Number.isFinite(a)) {
      t = void 0;
      continue;
    }
    if (t !== void 0) {
      const o = a - t;
      o >= 0 && e.set(s, o);
    }
    t = a;
  }
  return e;
}
function we(n, e) {
  const t = te(e?.[n.export_energy_entity]), i = n.self_consumption_entity ? te(e?.[n.self_consumption_entity]) : void 0, s = n.production_energy_entity ? te(e?.[n.production_energy_entity]) : void 0, a = new Map(
    (n.individual_consumers ?? []).map((r) => [
      r.entity,
      te(e?.[r.entity])
    ])
  );
  return [.../* @__PURE__ */ new Set([
    ...t.keys(),
    ...i?.keys() ?? [],
    ...s?.keys() ?? []
  ])].sort().flatMap((r) => {
    const l = t.get(r);
    if (l === void 0) return [];
    const c = i ? i.get(r) : s?.get(r) === void 0 ? void 0 : Math.max(0, s.get(r) - l);
    return c === void 0 || !Number.isFinite(c) || c < 0 ? [] : [
      {
        date: r,
        selfConsumption: c,
        exported: l,
        ...a.size > 0 ? {
          individualConsumers: Object.fromEntries(
            [...a].map(([u, d]) => [u, d.get(r) ?? 0])
          )
        } : {}
      }
    ];
  });
}
function Ue(n, e) {
  const t = n.self_consumption_entity ? ["direct", n.self_consumption_entity, n.export_energy_entity] : ["derived", n.production_energy_entity, n.export_energy_entity];
  return JSON.stringify([
    t,
    (n.individual_consumers ?? []).map((i) => i.entity),
    n.start_date,
    e
  ]);
}
function Ze(n, e, t = /* @__PURE__ */ new Date()) {
  if (!n.callWS || !he(e) || (e.annual_discount_rate ?? 0) <= 0)
    return;
  const i = /* @__PURE__ */ new Date(`${e.start_date}T00:00:00`);
  if (Number.isNaN(i.getTime()) || Number.isNaN(t.getTime())) return;
  const s = D(i);
  s.setDate(s.getDate() - 1);
  const a = D(t), o = D(t);
  o.setDate(o.getDate() - 1);
  const r = M(o), l = Ue(e, r), c = ve.get(l);
  if (c) return c;
  const u = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity];
  u.push(...(e.individual_consumers ?? []).map((h) => h.entity));
  const d = n.callWS({
    type: "recorder/statistics_during_period",
    start_time: `${M(s)}T00:00:00`,
    end_time: `${M(a)}T00:00:00`,
    statistic_ids: u,
    period: "day",
    types: ["sum"]
  }).then(
    (h) => h && typeof h == "object" ? h : void 0
  ).catch(() => {
  });
  return ve.set(l, d), d;
}
function Ge(n, e, t, i) {
  const s = n.use_location_seasonality && ae(i?.latitude, i?.longitude), a = [];
  for (let r = D(e); r <= D(t); r.setDate(r.getDate() + 1))
    a.push({
      date: new Date(r),
      weight: s ? F(r, i.latitude) : 1
    });
  return a.reduce((r, l) => r + l.weight, 0) > 0 ? a : a.map((r) => ({ ...r, weight: 1 }));
}
function Xe(n, e, t, i, s, a, o = []) {
  const r = /* @__PURE__ */ new Date(`${n.start_date}T00:00:00`);
  if (Number.isNaN(r.getTime()) || r > i) return [];
  const l = Ge(n, r, i, s), c = new Map((a ?? []).map((v) => [v.date, v])), u = (v, $) => {
    const m = l.map(
      ({ date: g }) => Math.max(0, c.get(M(g))?.[$] ?? 0)
    ), w = m.reduce((g, S) => g + S, 0), k = l.reduce(
      (g, S, E) => g + (m[E] > 0 ? 0 : S.weight),
      0
    ), p = l.map((g, S) => w > 0 && m[S] > 0 ? m[S] : k > 0 ? v * g.weight / k : 0), x = p.reduce((g, S) => g + S, 0);
    return x > 0 ? p.map((g) => g * v / x) : p;
  }, d = u(Math.max(0, e), "selfConsumption"), h = u(Math.max(0, t), "exported"), b = new Map(
    o.map((v) => {
      const $ = l.map(
        ({ date: x }) => Math.max(0, c.get(M(x))?.individualConsumers?.[v.entity] ?? 0)
      ), m = $.reduce((x, g) => x + g, 0), w = l.reduce(
        (x, g, S) => x + ($[S] > 0 ? 0 : g.weight),
        0
      ), k = l.map((x, g) => m > 0 && $[g] > 0 ? $[g] : w > 0 ? v.energy * x.weight / w : 0), p = k.reduce((x, g) => x + g, 0);
      return [
        v.entity,
        p > 0 ? k.map((x) => x * v.energy / p) : k
      ];
    })
  );
  return l.map((v, $) => ({
    date: M(v.date),
    selfConsumption: d[$],
    exported: h[$],
    individualConsumers: Object.fromEntries(
      [...b].map(([m, w]) => [m, w[$]])
    )
  }));
}
function Qe(n, e, t, i) {
  const s = /* @__PURE__ */ new Date(`${n.start_date}T00:00:00`), a = n.annual_discount_rate ?? 0;
  let o = 0;
  const r = {};
  let l = 0, c = 0, u;
  for (const m of t) {
    const w = /* @__PURE__ */ new Date(`${m.date}T00:00:00`), k = ce(w, s, a), p = (n.individual_consumers ?? []).reduce(
      (E, T) => E + (m.individualConsumers?.[T.entity] ?? 0),
      0
    ), x = Math.max(0, m.selfConsumption - p) * n.electricity_price * k, g = m.exported * n.feed_in_tariff * ce(w, s, a);
    o += x;
    let S = 0;
    for (const E of n.individual_consumers ?? []) {
      const T = (m.individualConsumers?.[E.entity] ?? 0) * E.value_per_kwh * k;
      r[E.entity] = (r[E.entity] ?? 0) + T, S += T;
    }
    l += g, c += x + S + g, !u && c >= n.investment_cost && (u = w);
  }
  if (u)
    return { regularValue: o, individualValues: r, exportValue: l, paybackDate: u };
  const d = n.use_location_seasonality && ae(i?.latitude, i?.longitude), h = t.reduce(
    (m, w) => m + (d ? F(/* @__PURE__ */ new Date(`${w.date}T00:00:00`), i.latitude) : 1),
    0
  ), b = t.reduce(
    (m, w) => m + Math.max(
      0,
      w.selfConsumption - (n.individual_consumers ?? []).reduce(
        (k, p) => k + (w.individualConsumers?.[p.entity] ?? 0),
        0
      )
    ) * n.electricity_price + (n.individual_consumers ?? []).reduce(
      (k, p) => k + (w.individualConsumers?.[p.entity] ?? 0) * p.value_per_kwh,
      0
    ) + w.exported * n.feed_in_tariff,
    0
  );
  if (h <= 0 || b <= 0)
    return { regularValue: o, individualValues: r, exportValue: l };
  const v = b / h, $ = D(e);
  for (let m = 0; m < 18300; m += 1) {
    $.setDate($.getDate() + 1);
    const w = d ? F($, i.latitude) : 1;
    if (c += v * w * ce($, s, a), c >= n.investment_cost)
      return { regularValue: o, individualValues: r, exportValue: l, paybackDate: new Date($) };
  }
  return { regularValue: o, individualValues: r, exportValue: l };
}
function ie(n, e, t, i = /* @__PURE__ */ new Date(), s, a, o = {}) {
  const r = Math.max(0, t - (n.export_energy_baseline ?? 0)), l = n.self_consumption_entity ? Math.max(0, e - (n.self_consumption_baseline ?? 0)) : Math.max(
    0,
    e - (n.production_energy_baseline ?? 0) - r
  ), c = (n.individual_consumers ?? []).map((A) => ({
    ...A,
    energy: Math.max(
      0,
      (o[A.entity] ?? 0) - (A.baseline ?? 0)
    ),
    value: 0
  })), u = c.reduce((A, C) => A + C.energy, 0), d = Math.max(0, l - u), h = u > l, b = d * n.electricity_price, v = c.map((A) => ({
    ...A,
    value: A.energy * A.value_per_kwh
  })), $ = b + v.reduce((A, C) => A + C.value, 0), m = r * n.feed_in_tariff;
  if (he(n) && (n.annual_discount_rate ?? 0) > 0) {
    const A = Xe(
      n,
      l,
      r,
      i,
      s,
      a,
      c
    ), C = Qe(n, i, A, s), V = c.map((P) => ({
      ...P,
      value: C.individualValues[P.entity] ?? 0
    })), K = C.regularValue + V.reduce((P, O) => P + O.value, 0), B = K + C.exportValue;
    return {
      selfConsumption: l,
      regularSelfConsumption: d,
      individualConsumers: V,
      individualConsumptionExceedsTotal: h,
      exported: r,
      ownValue: K,
      exportValue: C.exportValue,
      benefit: B,
      progress: Math.min(100, B / n.investment_cost * 100),
      paybackDate: C.paybackDate
    };
  }
  const w = $, k = m, p = w + k, x = Math.min(100, p / n.investment_cost * 100), g = /* @__PURE__ */ new Date(`${n.start_date}T00:00:00`), S = Le(g, i, p, n.investment_cost), E = s?.latitude, T = s?.longitude, le = n.use_location_seasonality && ae(E, T) ? qe(
    n.start_date,
    i,
    p,
    n.investment_cost,
    E
  ) ?? S : S;
  return {
    selfConsumption: l,
    regularSelfConsumption: d,
    individualConsumers: v,
    individualConsumptionExceedsTotal: h,
    exported: r,
    ownValue: w,
    exportValue: k,
    benefit: p,
    progress: x,
    paybackDate: le
  };
}
function et(n, e, t, i = /* @__PURE__ */ new Date(), s, a, o = n.annual_discount_rate ?? 3, r = {}) {
  const l = {
    ...n,
    apply_annual_discount: !1,
    use_historical_statistics: !1
  };
  return {
    linear: ie(
      { ...l, use_location_seasonality: !1, annual_discount_rate: 0 },
      e,
      t,
      i,
      s,
      a,
      r
    ),
    seasonal: ie(
      { ...l, use_location_seasonality: !0, annual_discount_rate: 0 },
      e,
      t,
      i,
      s,
      a,
      r
    ),
    discounted: ie(
      {
        ...l,
        use_location_seasonality: !0,
        annual_discount_rate: o,
        apply_annual_discount: !0
      },
      e,
      t,
      i,
      s,
      a,
      r
    )
  };
}
function Y(n, e) {
  const t = !!n.self_consumption_entity;
  return `pv-payback-card:last-valid:${JSON.stringify([
    t ? "direct-self-consumption" : "derived-self-consumption",
    t ? n.self_consumption_entity : n.production_energy_entity,
    n.export_energy_entity,
    n.start_date,
    n.self_consumption_baseline ?? 0,
    n.production_energy_baseline ?? 0,
    n.export_energy_baseline ?? 0,
    n.individual_consumers ?? []
  ])}:${e}`;
}
function tt(n, e) {
  if (n)
    for (let t = n.length - 1; t >= 0; t -= 1) {
      const i = n[t], s = i.s ?? i.state;
      if (typeof s == "string" && s.trim() === "" || s === null || s === void 0)
        continue;
      const a = typeof s == "number" ? s : Number(s), o = ue(a, e);
      if (o === void 0 || o < 0) continue;
      const r = typeof i.last_updated == "string" ? i.last_updated : typeof i.lu == "number" && Number.isFinite(i.lu) ? new Date(i.lu * 1e3).toISOString() : void 0;
      return { value: o, timestamp: r };
    }
}
function it(n, e, t = /* @__PURE__ */ new Date()) {
  const i = Object.keys(e).sort();
  if (!n.callWS || i.length === 0 || Number.isNaN(t.getTime())) return;
  const s = Math.floor(t.getTime() / (300 * 1e3)), a = JSON.stringify([i, s]), o = be.get(a);
  if (o) return o;
  const r = new Date(t.getTime() - 1440 * 60 * 1e3), l = n.callWS({
    type: "history/history_during_period",
    start_time: r.toISOString(),
    end_time: t.toISOString(),
    entity_ids: i,
    include_start_time_state: !0,
    significant_changes_only: !0,
    minimal_response: !0,
    no_attributes: !0
  }).then((c) => {
    if (!c || typeof c != "object") return {};
    const u = c;
    return Object.fromEntries(
      i.flatMap((d) => {
        const h = tt(u[d], e[d]);
        return h ? [[d, h]] : [];
      })
    );
  }).catch(() => ({}));
  return be.set(a, l), l;
}
function nt(n) {
  if (n)
    try {
      const e = JSON.parse(n);
      return typeof e.value != "number" || !Number.isFinite(e.value) || e.value < 0 ? void 0 : {
        value: e.value,
        timestamp: typeof e.timestamp == "string" ? e.timestamp : void 0
      };
    } catch {
      return;
    }
}
function xe(n, e) {
  try {
    return nt(n.getItem(e));
  } catch {
    return;
  }
}
function st(n, e) {
  return n !== void 0 && n >= 0 ? e && n < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: n, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function at(n) {
  if (n.display_style !== void 0 && !["full", "compact"].includes(n.display_style))
    return "display_style";
  if (n.payback_date_format !== void 0 && !["absolute", "relative"].includes(n.payback_date_format))
    return "payback_date_format";
  if (n.payback_date_relative_reference !== void 0 && !["now", "start_date"].includes(n.payback_date_relative_reference))
    return "payback_date_relative_reference";
  if (!n.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${n.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const t of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(n[t]) || n[t] < 0) return t;
  if (n.investment_cost <= 0) return "investment_cost";
  for (const t of [
    "self_consumption_baseline",
    "production_energy_baseline",
    "export_energy_baseline"
  ]) {
    const i = n[t];
    if (i !== void 0 && !Number.isFinite(i)) return t;
  }
  if (!Number.isFinite(n.annual_discount_rate ?? 0) || (n.annual_discount_rate ?? 0) < 0)
    return "annual_discount_rate";
  const e = /* @__PURE__ */ new Set();
  for (const t of n.individual_consumers ?? []) {
    if (!t.name?.trim()) return "individual_consumers.name";
    if (!t.entity?.trim() || e.has(t.entity)) return "individual_consumers.entity";
    if (e.add(t.entity), !Number.isFinite(t.value_per_kwh) || t.value_per_kwh < 0)
      return "individual_consumers.value_per_kwh";
    if (t.baseline !== void 0 && !Number.isFinite(t.baseline))
      return "individual_consumers.baseline";
  }
  if (!n.export_energy_entity || !n.self_consumption_entity && !n.production_energy_entity)
    return "energy entity";
}
function rt(n) {
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error("Invalid configuration: expected an object.");
  const e = n;
  if (e.type !== "custom:pv-payback-card")
    throw new Error("Invalid configuration: type must be custom:pv-payback-card.");
  if (typeof e.export_energy_entity != "string" || !e.export_energy_entity.trim())
    throw new Error("Invalid configuration: export_energy_entity is required.");
  const t = typeof e.self_consumption_entity == "string" && e.self_consumption_entity.trim().length > 0, i = typeof e.production_energy_entity == "string" && e.production_energy_entity.trim().length > 0;
  if (!t && !i)
    throw new Error(
      "Invalid configuration: self_consumption_entity or production_energy_entity is required."
    );
  if (e.individual_consumers !== void 0) {
    if (!Array.isArray(e.individual_consumers))
      throw new Error("Invalid configuration: individual_consumers must be an array.");
    for (const s of e.individual_consumers)
      if (!s || typeof s != "object" || typeof s.name != "string" || typeof s.entity != "string" || typeof s.value_per_kwh != "number" || s.baseline !== void 0 && typeof s.baseline != "number")
        throw new Error("Invalid configuration: malformed individual consumer.");
  }
}
const ne = globalThis, _e = ne.ShadowRoot && (ne.ShadyCSS === void 0 || ne.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, me = /* @__PURE__ */ Symbol(), ke = /* @__PURE__ */ new WeakMap();
let Ve = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== me) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (_e && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = ke.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && ke.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ot = (n) => new Ve(typeof n == "string" ? n : n + "", void 0, me), Ie = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((i, s, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[a + 1], n[0]);
  return new Ve(t, n, me);
}, lt = (n, e) => {
  if (_e) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = ne.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, n.appendChild(i);
  }
}, Se = _e ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return ot(t);
})(n) : n;
const { is: ct, defineProperty: dt, getOwnPropertyDescriptor: ut, getOwnPropertyNames: pt, getOwnPropertySymbols: ht, getPrototypeOf: _t } = Object, re = globalThis, De = re.trustedTypes, mt = De ? De.emptyScript : "", gt = re.reactiveElementPolyfillSupport, Z = (n, e) => n, pe = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? mt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, Fe = (n, e) => !ct(n, e), Ae = { attribute: !0, type: String, converter: pe, reflect: !1, useDefault: !1, hasChanged: Fe };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), re.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let I = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ae) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && dt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: a } = ut(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: s, set(o) {
      const r = s?.call(this);
      a?.call(this, o), this.requestUpdate(e, r, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Z("elementProperties"))) return;
    const e = _t(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Z("properties"))) {
      const t = this.properties, i = [...pt(t), ...ht(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, s] of t) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const s = this._$Eu(t, i);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) t.unshift(Se(s));
    } else e !== void 0 && t.push(Se(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return lt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : pe).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : pe;
      this._$Em = s;
      const r = o.fromAttribute(t, a.type);
      this[s] = r ?? this._$Ej?.get(s) ?? r, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, s = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (a = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? Fe)(a, t) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: a }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), a !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [s, a] of this._$Ep) this[s] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, a] of i) {
        const { wrapped: o } = a, r = this[s];
        o !== !0 || this._$AL.has(s) || r === void 0 || this.C(s, void 0, a, r);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
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
I.elementStyles = [], I.shadowRootOptions = { mode: "open" }, I[Z("elementProperties")] = /* @__PURE__ */ new Map(), I[Z("finalized")] = /* @__PURE__ */ new Map(), gt?.({ ReactiveElement: I }), (re.reactiveElementVersions ??= []).push("2.1.2");
const ge = globalThis, Ee = (n) => n, se = ge.trustedTypes, Ce = se ? se.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ze = "$lit$", N = `lit$${Math.random().toFixed(9).slice(2)}$`, je = "?" + N, yt = `<${je}>`, U = document, G = () => U.createComment(""), X = (n) => n === null || typeof n != "object" && typeof n != "function", ye = Array.isArray, ft = (n) => ye(n) || typeof n?.[Symbol.iterator] == "function", de = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Me = /-->/g, Te = />/g, W = RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ne = /'/g, Pe = /"/g, He = /^(?:script|style|textarea|title)$/i, vt = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), f = vt(1), j = /* @__PURE__ */ Symbol.for("lit-noChange"), _ = /* @__PURE__ */ Symbol.for("lit-nothing"), Oe = /* @__PURE__ */ new WeakMap(), R = U.createTreeWalker(U, 129);
function Ke(n, e) {
  if (!ye(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ce !== void 0 ? Ce.createHTML(e) : e;
}
const bt = (n, e) => {
  const t = n.length - 1, i = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = q;
  for (let r = 0; r < t; r++) {
    const l = n[r];
    let c, u, d = -1, h = 0;
    for (; h < l.length && (o.lastIndex = h, u = o.exec(l), u !== null); ) h = o.lastIndex, o === q ? u[1] === "!--" ? o = Me : u[1] !== void 0 ? o = Te : u[2] !== void 0 ? (He.test(u[2]) && (s = RegExp("</" + u[2], "g")), o = W) : u[3] !== void 0 && (o = W) : o === W ? u[0] === ">" ? (o = s ?? q, d = -1) : u[1] === void 0 ? d = -2 : (d = o.lastIndex - u[2].length, c = u[1], o = u[3] === void 0 ? W : u[3] === '"' ? Pe : Ne) : o === Pe || o === Ne ? o = W : o === Me || o === Te ? o = q : (o = W, s = void 0);
    const b = o === W && n[r + 1].startsWith("/>") ? " " : "";
    a += o === q ? l + yt : d >= 0 ? (i.push(c), l.slice(0, d) + ze + l.slice(d) + N + b) : l + N + (d === -2 ? r : b);
  }
  return [Ke(n, a + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Q {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let a = 0, o = 0;
    const r = e.length - 1, l = this.parts, [c, u] = bt(e, t);
    if (this.el = Q.createElement(c, i), R.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = R.nextNode()) !== null && l.length < r; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(ze)) {
          const h = u[o++], b = s.getAttribute(d).split(N), v = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: a, name: v[2], strings: b, ctor: v[1] === "." ? wt : v[1] === "?" ? xt : v[1] === "@" ? kt : oe }), s.removeAttribute(d);
        } else d.startsWith(N) && (l.push({ type: 6, index: a }), s.removeAttribute(d));
        if (He.test(s.tagName)) {
          const d = s.textContent.split(N), h = d.length - 1;
          if (h > 0) {
            s.textContent = se ? se.emptyScript : "";
            for (let b = 0; b < h; b++) s.append(d[b], G()), R.nextNode(), l.push({ type: 2, index: ++a });
            s.append(d[h], G());
          }
        }
      } else if (s.nodeType === 8) if (s.data === je) l.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(N, d + 1)) !== -1; ) l.push({ type: 7, index: a }), d += N.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const i = U.createElement("template");
    return i.innerHTML = e, i;
  }
}
function H(n, e, t = n, i) {
  if (e === j) return e;
  let s = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const a = X(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(n), s._$AT(n, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = s : t._$Cl = s), s !== void 0 && (e = H(n, s._$AS(n, e.values), s, i)), e;
}
class $t {
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
    const { el: { content: t }, parts: i } = this._$AD, s = (e?.creationScope ?? U).importNode(t, !0);
    R.currentNode = s;
    let a = R.nextNode(), o = 0, r = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new ee(a, a.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (c = new St(a, this, e)), this._$AV.push(c), l = i[++r];
      }
      o !== l?.index && (a = R.nextNode(), o++);
    }
    return R.currentNode = U, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class ee {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = H(this, e, t), X(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== j && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ft(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && X(this._$AH) ? this._$AA.nextSibling.data = e : this.T(U.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Q.createElement(Ke(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const a = new $t(s, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = Oe.get(e.strings);
    return t === void 0 && Oe.set(e.strings, t = new Q(e)), t;
  }
  k(e) {
    ye(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const a of e) s === t.length ? t.push(i = new ee(this.O(G()), this.O(G()), this, this.options)) : i = t[s], i._$AI(a), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = Ee(e).nextSibling;
      Ee(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class oe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, a) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(e, t = this, i, s) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = H(this, e, t, 0), o = !X(e) || e !== this._$AH && e !== j, o && (this._$AH = e);
    else {
      const r = e;
      let l, c;
      for (e = a[0], l = 0; l < a.length - 1; l++) c = H(this, r[i + l], t, l), c === j && (c = this._$AH[l]), o ||= !X(c) || c !== this._$AH[l], c === _ ? e = _ : e !== _ && (e += (c ?? "") + a[l + 1]), this._$AH[l] = c;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class wt extends oe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class xt extends oe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class kt extends oe {
  constructor(e, t, i, s, a) {
    super(e, t, i, s, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = H(this, e, t, 0) ?? _) === j) return;
    const i = this._$AH, s = e === _ && i !== _ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== _ && (i === _ || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class St {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    H(this, e);
  }
}
const Dt = ge.litHtmlPolyfillSupport;
Dt?.(Q, ee), (ge.litHtmlVersions ??= []).push("3.3.3");
const At = (n, e, t) => {
  const i = t?.renderBefore ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = t?.renderBefore ?? null;
    i._$litPart$ = s = new ee(e.insertBefore(G(), a), a, void 0, t ?? {});
  }
  return s._$AI(n), s;
};
const fe = globalThis;
class z extends I {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = At(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return j;
  }
}
z._$litElement$ = !0, z.finalized = !0, fe.litElementHydrateSupport?.({ LitElement: z });
const Et = fe.litElementPolyfillSupport;
Et?.({ LitElement: z });
(fe.litElementVersions ??= []).push("4.2.2");
const Ct = {
  de: {
    title: "Amortisation der PV-Anlage",
    benefit: "Bisheriger Ertrag",
    progress: "Amortisation",
    own: "Eigenverbrauch",
    export: "Einspeisung",
    individualConsumers: "Individuelle Verbraucher",
    individualConsumersExceedSelfConsumption: "Die individuellen Verbräuche überschreiten den gesamten PV-Eigenverbrauch. Prüfe Sensoren und Ausgangswerte.",
    expected: "Voraussichtlich amortisiert",
    remainingPayback: "Verbleibend ab heute",
    paybackDuration: "Dauer ab Startdatum",
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
    close: "Schließen",
    relativeYear: "Jahr",
    relativeYears: "Jahren",
    relativeMonth: "Monat",
    relativeMonths: "Monaten",
    relativeDay: "Tag",
    relativeDays: "Tagen",
    relativeIn: "in",
    relativeAfter: "nach",
    relativeToday: "heute",
    relativeOnStartDate: "am Startdatum",
    relativeBeforeStartDate: "vor dem Startdatum",
    relativeOverdue: "überfällig"
  },
  en: {
    title: "Solar payback",
    benefit: "Benefit to date",
    progress: "Payback",
    own: "Self-consumption",
    export: "Export",
    individualConsumers: "Individual consumers",
    individualConsumersExceedSelfConsumption: "Individual consumption exceeds total PV self-consumption. Check the sensors and baselines.",
    expected: "Estimated payback",
    remainingPayback: "Remaining from today",
    paybackDuration: "Duration from start date",
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
    close: "Close",
    relativeYear: "year",
    relativeYears: "years",
    relativeMonth: "month",
    relativeMonths: "months",
    relativeDay: "day",
    relativeDays: "days",
    relativeIn: "in",
    relativeAfter: "after",
    relativeToday: "today",
    relativeOnStartDate: "on the start date",
    relativeBeforeStartDate: "before the start date",
    relativeOverdue: "overdue"
  }
}, Mt = {
  de: {
    advanced_settings: "Erweiterte Einstellungen",
    advanced_settings_description: "Optionale Einstellungen für direkten Eigenverbrauch, Darstellung, Saisonalität und Abzinsung.",
    display_style: "Darstellung",
    display_style_full: "Vollständig",
    display_style_compact: "Kompakt",
    payback_date_format: "Format des Amortisationsdatums",
    payback_date_format_absolute: "Datum",
    payback_date_format_relative: "Zeitraum",
    payback_date_relative_reference: "Bezugspunkt für den Zeitraum",
    payback_date_relative_reference_now: "Ab heute",
    payback_date_relative_reference_start_date: "Ab Startdatum",
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
    apply_annual_discount: "Jährliche Abzinsung anwenden",
    individual_consumers: "Individuelle Verbraucher",
    individual_consumers_description: "Jeder Sensor muss ausschließlich zugeordneten PV-Verbrauch enthalten. Netzstrom muss bereits herausgerechnet sein.",
    individual_consumer_add: "Verbraucher hinzufügen",
    individual_consumer_remove: "Verbraucher entfernen",
    individual_consumer_name: "Name",
    individual_consumer_entity: "PV-Energie-Entität",
    individual_consumer_value: "Wert pro kWh",
    individual_consumer_baseline: "Ausgangswert (kWh)"
  },
  en: {
    advanced_settings: "Advanced settings",
    advanced_settings_description: "Optional settings for direct self-consumption, display, seasonality, and discounting.",
    display_style: "Display style",
    display_style_full: "Full",
    display_style_compact: "Compact",
    payback_date_format: "Payback date format",
    payback_date_format_absolute: "Calendar date",
    payback_date_format_relative: "Duration",
    payback_date_relative_reference: "Duration reference point",
    payback_date_relative_reference_now: "From today",
    payback_date_relative_reference_start_date: "From start date",
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
    apply_annual_discount: "Apply annual discounting",
    individual_consumers: "Individual consumers",
    individual_consumers_description: "Each sensor must contain only its assigned PV consumption. Grid energy must already be removed.",
    individual_consumer_add: "Add consumer",
    individual_consumer_remove: "Remove consumer",
    individual_consumer_name: "Name",
    individual_consumer_entity: "PV energy entity",
    individual_consumer_value: "Value per kWh",
    individual_consumer_baseline: "Baseline (kWh)"
  }
}, Tt = Ie`
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
  .individual-consumers {
    margin: 18px 0;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color);
  }
  .individual-consumers h3 {
    margin: 0 0 6px;
    font-size: 1em;
  }
  .individual-consumers p {
    margin: 0 0 12px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .individual-consumers fieldset {
    margin: 12px 0;
    padding: 8px 12px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }
  .individual-consumers legend {
    padding: 0 4px;
    font-weight: 600;
  }
  .add-consumer,
  .remove-consumer {
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--primary-color);
    background: transparent;
    color: var(--primary-color);
    border-radius: 6px;
    font: inherit;
    cursor: pointer;
  }
  .remove-consumer {
    border-color: var(--error-color, #db4437);
    color: var(--error-color, #db4437);
  }
`, Nt = Ie`
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
  .contribution-percentages {
    display: flex;
    width: 100%;
    margin-top: 6px;
    font-size: 0.78em;
    font-weight: 600;
    line-height: 1;
  }
  .contribution-percentages > span {
    flex-shrink: 0;
    overflow: visible;
    text-align: center;
    white-space: nowrap;
  }
  .contribution-percentage-own {
    color: var(--info-color, #03a9f4);
  }
  .contribution-percentage-export {
    color: var(--success-color, #4caf50);
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
  .individual-consumers-link {
    justify-self: start;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--primary-color);
    font: inherit;
    font-size: 0.78em;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }
  .individual-consumers-link:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 3px;
    border-radius: 2px;
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
  .individual-consumers-dialog {
    display: grid;
    min-width: min(420px, calc(100vw - 48px));
    gap: 2px;
    margin: 0;
    padding: 0 0 8px;
    list-style: none;
  }
  .individual-consumer-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 20px;
    min-height: 44px;
    padding: 10px 4px;
    border-bottom: 1px solid var(--divider-color);
    color: inherit;
  }
  .individual-consumer-row strong {
    white-space: nowrap;
  }
  ha-dialog.scenario-dialog-host {
    --mdc-dialog-min-width: min(1100px, calc(100vw - 48px));
    --mdc-dialog-max-width: min(1280px, calc(100vw - 48px));
  }
  .scenario-dialog {
    box-sizing: border-box;
    display: grid;
    width: 100%;
    max-width: none;
    gap: 12px;
    min-width: 0;
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
    grid-template-columns: minmax(100px, 0.8fr) repeat(3, minmax(120px, 1fr));
    gap: 12px;
  }
  .scenario-values div {
    display: grid;
    min-width: 0;
    gap: 4px;
  }
  .scenario-values span {
    font-size: 0.88em;
    line-height: 1.25;
  }
  .scenario-values strong {
    overflow-wrap: anywhere;
  }
  .scenario-values strong:last-child {
    text-align: end;
  }
  @media (max-width: 520px) {
    ha-dialog.scenario-dialog-host {
      --mdc-dialog-min-width: calc(100vw - 24px);
      --mdc-dialog-max-width: calc(100vw - 24px);
    }
    .scenario-dialog {
      width: auto;
      min-width: 0;
    }
    .scenario-values {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
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
    .scenario-values {
      grid-template-columns: 1fr;
    }
    .scenario-values strong:last-child {
      text-align: start;
    }
  }
`, We = 180 * 1e3;
class Pt extends z {
  static properties = {
    hass: { attribute: !1 },
    _config: { state: !0 },
    _scenarioDialogOpen: { state: !0 },
    _individualConsumersDialogOpen: { state: !0 },
    _contributionTooltipOpen: { state: !0 },
    _warningDialogMessage: { state: !0 }
  };
  constructor() {
    super(), this._scenarioDialogOpen = !1, this._individualConsumersDialogOpen = !1, this._contributionTooltipOpen = !1;
  }
  static getStubConfig() {
    return {
      type: "custom:pv-payback-card",
      display_style: "full",
      payback_date_format: "absolute",
      payback_date_relative_reference: "now",
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
    rt(e), this._comparisonDiscountRate = e.annual_discount_rate ?? 3, this._comparisonUsesDefaultRate = e.annual_discount_rate === void 0, this._config = Be(e), this._contributionTooltipOpen = !1, this._individualConsumersDialogOpen = !1, this._historicalStatistics = void 0, this._historicalStatisticsKey = void 0, this._historyRecoveryKey = void 0, this._calculationCache = void 0, this._scenarioCalculationCache = void 0, this.resetWarningDelay();
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
    if ([...e.keys()].some((o) => o !== "hass") || !e.has("hass")) return !0;
    const t = e.get("hass"), i = this.hass, s = this._config;
    return !s || !t || !i || t.locale?.language !== i.locale?.language || t.config?.currency !== i.config?.currency || t.config?.latitude !== i.config?.latitude || t.config?.longitude !== i.config?.longitude ? !0 : [
      s.self_consumption_entity ?? s.production_energy_entity,
      s.export_energy_entity,
      ...(s.individual_consumers ?? []).map((o) => o.entity)
    ].filter((o) => !!o).some((o) => {
      const r = t.states[o], l = i.states[o];
      return r?.state !== l?.state || r?.last_updated !== l?.last_updated || r?.attributes?.unit_of_measurement !== l?.attributes?.unit_of_measurement;
    });
  }
  resetWarningDelay() {
    this._warningStartedAt.clear(), this._warningTimer !== void 0 && clearTimeout(this._warningTimer), this._warningTimer = void 0;
  }
  persistentWarningReadings(e) {
    const t = Date.now(), i = e.filter(
      (r) => r.issueKey !== void 0
    ), s = new Set(i.map((r) => r.issueKey));
    for (const r of this._warningStartedAt.keys())
      s.has(r) || this._warningStartedAt.delete(r);
    for (const r of i)
      this._warningStartedAt.has(r.issueKey) || this._warningStartedAt.set(r.issueKey, t);
    const a = i.filter(
      (r) => t - this._warningStartedAt.get(r.issueKey) >= We
    ), o = i.map((r) => We - (t - this._warningStartedAt.get(r.issueKey))).filter((r) => r > 0);
    return this._warningTimer !== void 0 && clearTimeout(this._warningTimer), this._warningTimer = void 0, o.length > 0 && (this._warningTimer = setTimeout(
      () => {
        this._warningTimer = void 0, this.requestUpdate();
      },
      Math.min(...o)
    )), a;
  }
  updated() {
    this.flushPendingEnergyCacheWrites();
    const e = this._config;
    if (!(!e || !this.hass?.callWS)) {
      if (he(e) && (e.annual_discount_rate ?? 0) > 0) {
        const t = D(/* @__PURE__ */ new Date());
        t.setDate(t.getDate() - 1);
        const i = Ue(e, M(t));
        this._historicalStatisticsKey !== i && (this._historicalStatisticsKey = i, Ze(this.hass, e)?.then((s) => {
          s && this._historicalStatisticsKey === i && (this._historicalStatistics = s, this.requestUpdate());
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
    const t = [
      e.self_consumption_entity ?? e.production_energy_entity,
      e.export_energy_entity,
      ...(e.individual_consumers ?? []).map((a) => a.entity)
    ].filter((a) => !!a), i = {};
    for (const a of t) {
      const o = this.hass.states[a], r = o?.attributes?.unit_of_measurement;
      if (!J(r)) continue;
      const l = Number(o.state), c = ue(l, r), u = xe(localStorage, Y(e, a));
      c === void 0 && u === void 0 && (i[a] = r);
    }
    const s = JSON.stringify(
      Object.keys(i).sort().map((a) => Y(e, a))
    );
    Object.keys(i).length === 0 || this._historyRecoveryKey === s || (this._historyRecoveryKey = s, it(this.hass, i)?.then((a) => {
      if (this._historyRecoveryKey === s) {
        for (const [o, r] of Object.entries(a))
          try {
            localStorage.setItem(Y(e, o), JSON.stringify(r));
          } catch {
          }
        Object.keys(a).length > 0 && this.requestUpdate();
      }
    }));
  }
  getCardSize() {
    const e = this._config;
    if (!e) return 1;
    const t = Number(e.show_progress) + Number(e.show_breakdown && (e.show_energy_values || e.show_money_values)) + Number(e.show_payback_date), i = Number(e.show_progress && e.show_contribution_segments);
    return e.display_style === "compact" ? (t > 1 ? 2 : 1) + i : Math.max(1, 1 + t + i);
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
  readEnergy(e, t, i) {
    const s = this.hass?.states[t], a = s ? Number(s.state) : Number.NaN, o = ue(a, s?.attributes?.unit_of_measurement), r = xe(localStorage, Y(e, t)), l = st(o, r), c = s?.attributes?.unit_of_measurement, u = s && !J(c) ? i.unsupportedUnit : i.entityUnavailable;
    if (l.value !== void 0) {
      if (!l.cached) {
        const d = {
          value: l.value,
          timestamp: s?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        };
        (r?.value !== d.value || r.timestamp !== d.timestamp) && this._pendingEnergyCacheWrites.set(Y(e, t), d);
      }
      return {
        value: l.value,
        cached: l.cached,
        timestamp: l.cached ? r?.timestamp : s?.last_updated,
        warning: l.regression ? `${t}: ${i.counterRegression}` : l.cached ? `${t}: ${u}` : void 0,
        issueKey: l.cached ? `${t}:${l.regression ? "regression" : "unavailable"}` : void 0
      };
    }
    return {
      cached: !1,
      issueKey: `${t}:${s && !J(c) ? "unsupported-unit" : "unavailable"}`,
      warning: s && !J(c) ? `${t}: ${i.unsupportedUnit}` : `${t}: ${i.entityUnavailable}`
    };
  }
  text() {
    return Ct[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
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
  formatRelativePaybackDate(e, t, i) {
    if (!e) return "—";
    const s = this.text(), a = D(e), o = D(t);
    if (a.getTime() < o.getTime())
      return i ? s.relativeBeforeStartDate : s.relativeOverdue;
    if (a.getTime() === o.getTime())
      return i ? s.relativeOnStartDate : s.relativeToday;
    const { years: r, months: l, days: c } = Ye(o, a), u = [];
    return r && u.push(`${r} ${r === 1 ? s.relativeYear : s.relativeYears}`), l && u.push(`${l} ${l === 1 ? s.relativeMonth : s.relativeMonths}`), c && u.push(`${c} ${c === 1 ? s.relativeDay : s.relativeDays}`), `${i ? s.relativeAfter : s.relativeIn} ${u.join(", ")}`;
  }
  formatPaybackDate(e, t) {
    if (this._config?.payback_date_format !== "relative") return this.formatDate(e);
    const i = this._config.payback_date_relative_reference === "start_date", s = i ? /* @__PURE__ */ new Date(`${this._config.start_date}T00:00:00`) : t;
    return this.formatRelativePaybackDate(e, s, i);
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
  openIndividualConsumersDialog() {
    this._individualConsumersDialogOpen = !0;
  }
  closeIndividualConsumersDialog() {
    this._individualConsumersDialogOpen = !1;
  }
  renderIndividualConsumersDialog(e) {
    const t = this.text();
    return f`<ha-dialog
      .open=${this._individualConsumersDialogOpen}
      .heading=${t.individualConsumers}
      @closed=${this.closeIndividualConsumersDialog}
    >
      <ul class="individual-consumers-dialog">
        ${e.individualConsumers.map(
      (i) => f`<li class="individual-consumer-row">
              <span>${i.name}</span>
              <strong
                >${this.formatEnergy(i.energy)} · ${this.formatMoney(i.value)}</strong
              >
            </li>`
    )}
      </ul>
      <ha-button slot="primaryAction" @click=${this.closeIndividualConsumersDialog}
        >${t.close}</ha-button
      >
    </ha-dialog>`;
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
  renderScenarioDialog(e, t, i) {
    const s = this.text(), a = [
      {
        name: s.scenarioLinear,
        scenario: e.linear,
        icon: "mdi:chart-line",
        className: "scenario-linear"
      },
      {
        name: s.scenarioSeasonal,
        scenario: e.seasonal,
        icon: "mdi:weather-sunny",
        className: "scenario-seasonal"
      },
      {
        name: s.scenarioDiscounted,
        scenario: e.discounted,
        icon: "mdi:percent-circle-outline",
        className: "scenario-discounted"
      }
    ], o = [
      t ? void 0 : s.locationFallback,
      a.some(({ scenario: r }) => !r.paybackDate) ? s.noProjection : void 0
    ].filter((r) => r !== void 0);
    return f`<ha-dialog
      class="scenario-dialog-host"
      .open=${this._scenarioDialogOpen}
      .heading=${s.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${o.length > 0 ? f`<div class="scenario-warning">
                ${this.renderWarningIndicator(o.join(`
`))}
              </div>` : _}
        ${a.map(
      ({ name: r, scenario: l, icon: c, className: u }, d) => f`<section class=${`scenario ${u}`}>
              <div class="scenario-heading">
                <ha-icon .icon=${c}></ha-icon>
                <h3>${r}</h3>
              </div>
              ${d === 2 ? f`<div class="scenario-rate">
                      ${s.discountRate}: ${this.formatPercentage(this._comparisonDiscountRate)}
                      ${this._comparisonUsesDefaultRate ? f`(${s.defaultRate})` : _}
                    </div>` : _}
              <div class="scenario-values">
                <div class="scenario-benefit">
                  <span>${s.benefit}</span><strong>${this.formatMoney(l.benefit, 2)}</strong>
                </div>
                <div class="scenario-payback-date">
                  <span>${s.expected}</span
                  ><strong>${this.formatDate(l.paybackDate)}</strong>
                </div>
                <div class="scenario-payback-remaining">
                  <span>${s.remainingPayback}</span
                  ><strong
                    >${this.formatRelativePaybackDate(l.paybackDate, i, !1)}</strong
                  >
                </div>
                <div class="scenario-payback-duration">
                  <span>${s.paybackDuration}</span
                  ><strong
                    >${this.formatRelativePaybackDate(
        l.paybackDate,
        /* @__PURE__ */ new Date(`${this._config.start_date}T00:00:00`),
        !0
      )}</strong
                  >
                </div>
              </div>
            </section>`
    )}
      </div>
      <ha-button slot="primaryAction" @click=${this.closeScenarioDialog}>${s.close}</ha-button>
    </ha-dialog>`;
  }
  renderWarningIndicator(e) {
    return f`<button
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
    if (!this._warningDialogMessage) return _;
    const e = this.text();
    return f`<ha-dialog
      .open=${!0}
      .heading=${e.warningTitle}
      @closed=${this.closeWarningDialog}
    >
      <div class="warning-dialog-message">${this._warningDialogMessage}</div>
      <ha-button slot="primaryAction" @click=${this.closeWarningDialog}>${e.close}</ha-button>
    </ha-dialog>`;
  }
  renderStatusCard(e) {
    const t = this._config, i = this.text();
    return f`<ha-card>
        <div class="content status-only">
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${t.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${$e(t.name, i.title)}</span>
            </div>
            <div class="header-meta">
              ${e ? this.renderWarningIndicator(e) : _}
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
    if (!e) return _;
    const t = this.text(), i = at(e);
    if (i) {
      const y = this.persistentWarningReadings([
        {
          cached: !1,
          issueKey: `configuration:${i}`,
          warning: `${t.invalid}: ${i}`
        }
      ]);
      return this.renderStatusCard(y[0]?.warning);
    }
    const s = e.self_consumption_entity ? this.readEnergy(e, e.self_consumption_entity, t) : void 0, a = !s && e.production_energy_entity ? this.readEnergy(e, e.production_energy_entity, t) : void 0, o = this.readEnergy(e, e.export_energy_entity, t), r = (e.individual_consumers ?? []).map((y) => ({
      consumer: y,
      reading: this.readEnergy(e, y.entity, t)
    })), l = [
      s,
      a,
      o,
      ...r.map(({ reading: y }) => y)
    ].filter((y) => !!y);
    let c = this.persistentWarningReadings(l);
    const u = s?.value, d = a?.value, h = o.value;
    if (h === void 0 || s !== void 0 && u === void 0 || a !== void 0 && d === void 0 || r.some(({ reading: y }) => y.value === void 0)) {
      const y = c.length > 0 ? `${t.unavailable}${c.filter((L) => L.warning).map((L) => ` ${L.warning}`).join("")}` : void 0;
      return this.renderStatusCard(y);
    }
    const b = u ?? d, v = Object.fromEntries(
      r.map(({ consumer: y, reading: L }) => [y.entity, L.value])
    ), $ = /* @__PURE__ */ new Date(), m = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude
    }, w = this._historicalStatistics ? `loaded:${this._historicalStatisticsKey ?? ""}` : `approximation:${this._historicalStatisticsKey ?? ""}`, k = JSON.stringify([
      e,
      b,
      h,
      v,
      M($),
      m,
      w
    ]);
    this._calculationCache?.key !== k && (this._calculationCache = {
      key: k,
      calculation: ie(
        e,
        b,
        h,
        $,
        m,
        we(e, this._historicalStatistics),
        v
      )
    });
    const p = this._calculationCache.calculation, x = e.show_payback_date && !p.paybackDate ? {
      cached: !1,
      issueKey: "projection:no-positive-benefit",
      warning: t.noProjection
    } : void 0;
    c = this.persistentWarningReadings([
      ...l,
      ...x ? [x] : []
    ]);
    let g;
    if (this._scenarioDialogOpen) {
      const y = `${k}:${this._comparisonDiscountRate}`;
      this._scenarioCalculationCache?.key !== y && (this._scenarioCalculationCache = {
        key: y,
        scenarios: et(
          e,
          b,
          h,
          $,
          m,
          we(e, this._historicalStatistics),
          this._comparisonDiscountRate,
          v
        )
      }), g = this._scenarioCalculationCache.scenarios;
    }
    const S = c.filter(
      (y) => y.issueKey !== "projection:no-positive-benefit"
    ), E = S.map((y) => y.timestamp).filter(Boolean).sort().at(0), T = S.length > 0 ? `${t.cached}${E ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(E))}` : ""}${S.filter((y) => y.warning).map((y) => ` ${y.warning}`).join("")}` : void 0, le = c.some(
      (y) => y.issueKey === "projection:no-positive-benefit"
    ) ? t.noProjection : void 0, A = p.individualConsumptionExceedsTotal ? t.individualConsumersExceedSelfConsumption : void 0, C = [T, A, le].filter((y) => !!y).join(`
`), V = Math.min(
      100,
      Math.max(0, p.ownValue / e.investment_cost * 100)
    ), K = Math.min(
      Math.max(0, 100 - V),
      Math.max(0, p.exportValue / e.investment_cost * 100)
    ), B = p.benefit > 0 ? p.ownValue / p.benefit * 100 : 0, P = p.benefit > 0 ? p.exportValue / p.benefit * 100 : 0, O = e.display_style === "compact";
    return f`<ha-card>
        <div class=${`content ${O ? "compact" : "full"}`}>
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${$e(e.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${C ? this.renderWarningIndicator(C) : _}
              ${e.show_progress ? f`<span class="header-progress">${p.progress.toFixed(1)}%</span>` : _}
            </div>
          </div>
          <div class="benefit" title=${O ? t.benefit : _}>
            <span>${t.benefit}</span
            ><button
              type="button"
              class="scenario-trigger"
              aria-label=${`${t.scenariosOpen}: ${t.benefit}`}
              @click=${this.openScenarioDialog}
            >
              ${this.formatMoney(p.benefit)}
            </button>
          </div>
          ${e.show_progress ? f`<button
                  class=${`progress-trigger ${this._contributionTooltipOpen ? "tooltip-open" : ""}`}
                  type="button"
                  aria-label=${`${t.progress}: ${this.formatPercentage(p.progress)}`}
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
                    aria-valuenow=${p.progress}
                  >
                    ${e.show_contribution_segments ? f`<span
                              class="contribution-own"
                              style=${`width:${V}%`}
                            ></span>
                            <span
                              class="contribution-export"
                              style=${`width:${K}%`}
                            ></span>` : f`<span style=${`width:${p.progress}%`}></span>`}
                  </span>
                  ${e.show_contribution_segments ? f`<span class="contribution-percentages" aria-hidden="true">
                          <span
                            class="contribution-percentage-own"
                            style=${`width:${V}%`}
                            >${this.formatPercentage(B)}</span
                          >
                          <span
                            class="contribution-percentage-export"
                            style=${`width:${K}%`}
                            >${this.formatPercentage(P)}</span
                          >
                        </span>` : _}
                  <span id="contribution-tooltip" class="progress-tooltip" role="tooltip">
                    <span class="tooltip-row tooltip-own">
                      <span>${t.own}</span>
                      <strong
                        >${this.formatPercentage(B)} ·
                        ${this.formatMoney(p.ownValue)}</strong
                      >
                    </span>
                    <span class="tooltip-row tooltip-export">
                      <span>${t.export}</span>
                      <strong
                        >${this.formatPercentage(P)} ·
                        ${this.formatMoney(p.exportValue)}</strong
                      >
                    </span>
                  </span>
                </button>` : _}
          ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? f`<div
                  class="breakdown ${e.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <div class="breakdown-group">
                    <button
                      class="own breakdown-action"
                      type="button"
                      ?disabled=${!e.self_consumption_entity}
                      aria-label=${t.own}
                      title=${O ? t.own : _}
                      @click=${() => e.self_consumption_entity && this.openMoreInfo(e.self_consumption_entity)}
                    >
                      <span>${t.own}</span
                      ><b
                        >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(p.selfConsumption)} · ${this.formatMoney(p.ownValue)}` : e.show_energy_values ? this.formatEnergy(p.selfConsumption) : this.formatMoney(p.ownValue)}</b
                      >
                    </button>
                    ${p.individualConsumers.length > 0 ? f`<button
                            class="individual-consumers-link"
                            type="button"
                            @click=${this.openIndividualConsumersDialog}
                          >
                            ${t.individualConsumers}
                          </button>` : _}
                  </div>
                  <button
                    class="export breakdown-action"
                    type="button"
                    aria-label=${t.export}
                    title=${O ? t.export : _}
                    @click=${() => this.openMoreInfo(e.export_energy_entity)}
                  >
                    <span>${t.export}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(p.exported)} · ${this.formatMoney(p.exportValue)}` : e.show_energy_values ? this.formatEnergy(p.exported) : this.formatMoney(p.exportValue)}</b
                    >
                  </button>
                </div>` : _}
          ${e.show_payback_date ? f`<div class="date" title=${O ? t.expected : _}>
                  <span>${t.expected}</span
                  ><button
                    type="button"
                    class="scenario-trigger"
                    aria-label=${`${t.scenariosOpen}: ${t.expected}`}
                    @click=${this.openScenarioDialog}
                  >
                    ${this.formatPaybackDate(p.paybackDate, $)}
                  </button>
                </div>` : _}
        </div>
      </ha-card>
      ${this._scenarioDialogOpen && g ? this.renderScenarioDialog(
      g,
      ae(m.latitude, m.longitude),
      $
    ) : _}
      ${this._individualConsumersDialogOpen && p.individualConsumers.length > 0 ? this.renderIndividualConsumersDialog(p) : _}
      ${this.renderWarningDialog()}`;
  }
  static styles = Nt;
}
customElements.define("pv-payback-card", Pt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "Solar Payback Card",
  description: "Displays solar financial payback from cumulative energy sensors."
});
class Ot extends z {
  static properties = {
    hass: { attribute: !1 },
    _config: { state: !0 },
    _advancedOpen: { state: !0 }
  };
  constructor() {
    super(), this._config = {}, this._advancedOpen = !1;
  }
  setConfig(e) {
    this._config = { ...e }, (e.self_consumption_entity || e.self_consumption_baseline !== void 0 || e.use_location_seasonality === !0 || e.apply_annual_discount === !0 || e.use_historical_statistics === !0 || (e.annual_discount_rate ?? 0) !== 0 || e.show_breakdown === !1 || e.show_energy_values === !1 || e.show_money_values === !1 || e.show_payback_date === !1 || e.show_progress === !1 || e.payback_date_format === "relative") && (this._advancedOpen = !0);
  }
  toggleAdvanced() {
    this._advancedOpen = !this._advancedOpen;
  }
  emitConfig(e) {
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  changed(e) {
    const t = e.target, i = [
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
    else if (i) {
      const a = t.value.trim();
      if (!a)
        delete s[t.name];
      else {
        const o = Number(a);
        if (!Number.isFinite(o)) return;
        s[t.name] = o;
      }
    } else
      s[t.name] = t.value;
    this.emitConfig(s);
  }
  entityChanged(e, t) {
    const i = t.detail?.value, s = typeof i == "string" ? i.trim() : "", a = { ...this._config };
    s ? a[e] = s : delete a[e], this.emitConfig(a);
  }
  addIndividualConsumer() {
    const e = [...this._config.individual_consumers ?? []];
    e.push({ name: "", entity: "", value_per_kwh: 0, baseline: 0 }), this.emitConfig({ ...this._config, individual_consumers: e });
  }
  removeIndividualConsumer(e) {
    const t = [...this._config.individual_consumers ?? []];
    t.splice(e, 1);
    const i = { ...this._config };
    t.length > 0 ? i.individual_consumers = t : delete i.individual_consumers, this.emitConfig(i);
  }
  changeIndividualConsumer(e, t, i) {
    const s = (this._config.individual_consumers ?? []).map((o) => ({
      ...o
    })), a = s[e];
    if (a) {
      if (t === "value_per_kwh" || t === "baseline") {
        const o = String(i ?? "").trim();
        if (!o && t === "baseline") delete a.baseline;
        else {
          const r = Number(o);
          if (!Number.isFinite(r)) return;
          a[t] = r;
        }
      } else {
        const o = String(i ?? "").trim();
        a[t] = o;
      }
      this.emitConfig({ ...this._config, individual_consumers: s });
    }
  }
  individualConsumerEntityField(e, t, i) {
    return this.hass && customElements.get("ha-entity-picker") ? f`<ha-entity-picker
        .hass=${this.hass}
        .value=${e.entity}
        .label=${i}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${!0}
        @value-changed=${(a) => this.changeIndividualConsumer(t, "entity", a.detail?.value)}
      ></ha-entity-picker>` : f`<label
      >${i}<input
        type="text"
        .value=${e.entity}
        @change=${(a) => this.changeIndividualConsumer(t, "entity", a.target.value)}
    /></label>`;
  }
  entityField(e, t) {
    const i = String(this._config[e] ?? "");
    return this.hass && customElements.get("ha-entity-picker") ? f`<ha-entity-picker
        .hass=${this.hass}
        .value=${i}
        .label=${t}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${!0}
        @value-changed=${(a) => this.entityChanged(e, a)}
      ></ha-entity-picker>` : f`<label
      >${t}<input name=${e} type="text" .value=${i} @change=${this.changed}
    /></label>`;
  }
  render() {
    const e = Mt[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
      ["start_date", e.start_date, "date"],
      ["investment_cost", e.investment_cost, "number"],
      ["electricity_price", e.electricity_price, "number"],
      ["feed_in_tariff", e.feed_in_tariff, "number"]
    ], i = [
      ["production_energy_baseline", e.production_energy_baseline, "number"],
      ["export_energy_baseline", e.export_energy_baseline, "number"]
    ], s = [
      ["self_consumption_baseline", e.self_consumption_baseline, "number"],
      ["annual_discount_rate", e.annual_discount_rate, "number"]
    ], a = ([r, l, c]) => f`<label
        >${l}<input
          name=${r}
          type=${c}
          step="any"
          .value=${String(this._config[r] ?? "")}
          @change=${this.changed}
      /></label>`, o = (r) => f`<label
        ><input
          name=${r}
          type="checkbox"
          .checked=${r === "show_contribution_segments" || r === "use_location_seasonality" || r === "apply_annual_discount" ? this._config[r] === !0 : this._config[r] !== !1}
          @change=${this.changed}
        />${e[r]}</label
      >`;
    return f`${t.map(
      a
    )}${this.entityField("production_energy_entity", e.production_energy_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${i.map(
      a
    )}
      <section class="individual-consumers">
        <h3>${e.individual_consumers}</h3>
        <p>${e.individual_consumers_description}</p>
        ${(this._config.individual_consumers ?? []).map(
      (r, l) => f`<fieldset>
              <legend>${r.name || `${e.individual_consumers} ${l + 1}`}</legend>
              <label
                >${e.individual_consumer_name}<input
                  type="text"
                  .value=${r.name}
                  @change=${(c) => this.changeIndividualConsumer(
        l,
        "name",
        c.target.value
      )}
              /></label>
              ${this.individualConsumerEntityField(
        r,
        l,
        e.individual_consumer_entity
      )}
              <label
                >${e.individual_consumer_value}<input
                  type="number"
                  min="0"
                  step="any"
                  .value=${String(r.value_per_kwh)}
                  @change=${(c) => this.changeIndividualConsumer(
        l,
        "value_per_kwh",
        c.target.value
      )}
              /></label>
              <label
                >${e.individual_consumer_baseline}<input
                  type="number"
                  step="any"
                  .value=${String(r.baseline ?? "")}
                  @change=${(c) => this.changeIndividualConsumer(
        l,
        "baseline",
        c.target.value
      )}
              /></label>
              <button
                type="button"
                class="remove-consumer"
                @click=${() => this.removeIndividualConsumer(l)}
              >
                ${e.individual_consumer_remove}
              </button>
            </fieldset>`
    )}
        <button type="button" class="add-consumer" @click=${this.addIndividualConsumer}>
          ${e.individual_consumer_add}
        </button>
      </section>
      <label
        >${e.display_style}<select
          name="display_style"
          .value=${this._config.display_style ?? "full"}
          @change=${this.changed}
        >
          <option value="full">${e.display_style_full}</option>
          <option value="compact">${e.display_style_compact}</option>
        </select></label
      >${o("show_contribution_segments")}
      <button
        class="advanced-toggle"
        type="button"
        aria-expanded=${this._advancedOpen ? "true" : "false"}
        @click=${this.toggleAdvanced}
      >
        <span>${e.advanced_settings}</span>
        <ha-icon icon=${this._advancedOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
      ${this._advancedOpen ? f`<section class="advanced-settings">
              <p>${e.advanced_settings_description}</p>
              ${this.entityField("self_consumption_entity", e.self_consumption_entity)}
              ${s.map(a)} ${o("show_breakdown")}
              ${o("show_energy_values")} ${o("show_money_values")}
              ${o("show_payback_date")}
              <label
                >${e.payback_date_format}<select
                  name="payback_date_format"
                  .value=${this._config.payback_date_format ?? "absolute"}
                  @change=${this.changed}
                >
                  <option value="absolute">${e.payback_date_format_absolute}</option>
                  <option value="relative">${e.payback_date_format_relative}</option>
                </select></label
              >
              ${this._config.payback_date_format === "relative" ? f`<label
                      >${e.payback_date_relative_reference}<select
                        name="payback_date_relative_reference"
                        .value=${this._config.payback_date_relative_reference ?? "now"}
                        @change=${this.changed}
                      >
                        <option value="now">${e.payback_date_relative_reference_now}</option>
                        <option value="start_date">
                          ${e.payback_date_relative_reference_start_date}
                        </option>
                      </select></label
                    >` : _}
              ${o("show_progress")} ${o("use_location_seasonality")}
              ${o("apply_annual_discount")}
            </section>` : _}`;
  }
  static styles = Tt;
}
customElements.define("pv-payback-card-editor", Ot);
export {
  Re as BoundedCache,
  Wt as MAXIMUM_FORECAST_DAYS,
  Pt as PVPaybackCard,
  Ot as PVPaybackCardEditor,
  he as appliesAnnualDiscount,
  rt as assertConfigStructure,
  Y as cacheKey,
  ie as calculatePayback,
  et as calculateScenarioComparisons,
  qe as calculateSeasonalPaybackDate,
  D as calendarDay,
  Ye as calendarDuration,
  st as chooseEnergyValue,
  we as dailyEnergyFromStatistics,
  M as dateKey,
  $e as displayName,
  Xe as distributeHistoricalEnergy,
  ue as energyToKwh,
  Ue as historicalStatisticsCacheKey,
  J as isUnit,
  tt as latestValidEnergyFromHistory,
  Ze as loadHistoricalStatistics,
  it as loadLastValidEnergyHistory,
  nt as parseCachedEnergy,
  xe as readCachedEnergy,
  te as statisticDailyDeltas,
  at as validConfig,
  ae as validLocation,
  Be as withDisplayDefaults
};
