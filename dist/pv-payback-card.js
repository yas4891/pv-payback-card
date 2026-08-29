const U = globalThis, z = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, V = /* @__PURE__ */ Symbol(), L = /* @__PURE__ */ new WeakMap();
let ie = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== V) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (z && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = L.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && L.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ue = (i) => new ie(typeof i == "string" ? i : i + "", void 0, V), ne = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new ie(t, i, V);
}, pe = (i, e) => {
  if (z) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), n = U.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = t.cssText, i.appendChild(s);
  }
}, q = z ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return ue(t);
})(i) : i;
const { is: _e, defineProperty: ge, getOwnPropertyDescriptor: me, getOwnPropertyNames: fe, getOwnPropertySymbols: ye, getPrototypeOf: $e } = Object, O = globalThis, K = O.trustedTypes, be = K ? K.emptyScript : "", ve = O.reactiveElementPolyfillSupport, S = (i, e) => i, W = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? be : null;
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
} }, re = (i, e) => !_e(i, e), J = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: re };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), O.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = J) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(e, s, t);
      n !== void 0 && ge(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: n, set: r } = me(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: n, set(o) {
      const l = n?.call(this);
      r?.call(this, o), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? J;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const e = $e(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const t = this.properties, s = [...fe(t), ...ye(t)];
      for (const n of s) this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, n] of t) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const n = this._$Eu(t, s);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const n of s) t.unshift(q(n));
    } else e !== void 0 && t.push(q(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return pe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, s);
    if (n !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : W).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, n = s._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const r = s.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : W;
      this._$Em = n;
      const l = o.fromAttribute(t, r.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, n = !1, r) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[e]), s ??= o.getPropertyOptions(e), !((s.hasChanged ?? re)(r, t) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: n, wrapped: r }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), r !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, r] of s) {
        const { wrapped: o } = r, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, r, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[S("elementProperties")] = /* @__PURE__ */ new Map(), w[S("finalized")] = /* @__PURE__ */ new Map(), ve?.({ ReactiveElement: w }), (O.reactiveElementVersions ??= []).push("2.1.2");
const j = globalThis, Z = (i) => i, T = j.trustedTypes, G = T ? T.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, oe = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, ae = "?" + f, we = `<${ae}>`, v = document, C = () => v.createComment(""), P = (i) => i === null || typeof i != "object" && typeof i != "function", B = Array.isArray, xe = (i) => B(i) || typeof i?.[Symbol.iterator] == "function", R = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Q = /-->/g, X = />/g, $ = RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Y = /'/g, ee = /"/g, le = /^(?:script|style|textarea|title)$/i, Ae = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), g = Ae(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), te = /* @__PURE__ */ new WeakMap(), b = v.createTreeWalker(v, 129);
function ce(i, e) {
  if (!B(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return G !== void 0 ? G.createHTML(e) : e;
}
const Ee = (i, e) => {
  const t = i.length - 1, s = [];
  let n, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = k;
  for (let l = 0; l < t; l++) {
    const a = i[l];
    let p, u, h = -1, d = 0;
    for (; d < a.length && (o.lastIndex = d, u = o.exec(a), u !== null); ) d = o.lastIndex, o === k ? u[1] === "!--" ? o = Q : u[1] !== void 0 ? o = X : u[2] !== void 0 ? (le.test(u[2]) && (n = RegExp("</" + u[2], "g")), o = $) : u[3] !== void 0 && (o = $) : o === $ ? u[0] === ">" ? (o = n ?? k, h = -1) : u[1] === void 0 ? h = -2 : (h = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? $ : u[3] === '"' ? ee : Y) : o === ee || o === Y ? o = $ : o === Q || o === X ? o = k : (o = $, n = void 0);
    const m = o === $ && i[l + 1].startsWith("/>") ? " " : "";
    r += o === k ? a + we : h >= 0 ? (s.push(p), a.slice(0, h) + oe + a.slice(h) + f + m) : a + f + (h === -2 ? l : m);
  }
  return [ce(i, r + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class M {
  constructor({ strings: e, _$litType$: t }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const l = e.length - 1, a = this.parts, [p, u] = Ee(e, t);
    if (this.el = M.createElement(p, s), b.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = b.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(oe)) {
          const d = u[o++], m = n.getAttribute(h).split(f), y = /([.?@])?(.*)/.exec(d);
          a.push({ type: 1, index: r, name: y[2], strings: m, ctor: y[1] === "." ? Se : y[1] === "?" ? Ce : y[1] === "@" ? Pe : D }), n.removeAttribute(h);
        } else h.startsWith(f) && (a.push({ type: 6, index: r }), n.removeAttribute(h));
        if (le.test(n.tagName)) {
          const h = n.textContent.split(f), d = h.length - 1;
          if (d > 0) {
            n.textContent = T ? T.emptyScript : "";
            for (let m = 0; m < d; m++) n.append(h[m], C()), b.nextNode(), a.push({ type: 2, index: ++r });
            n.append(h[d], C());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ae) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(f, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += f.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = v.createElement("template");
    return s.innerHTML = e, s;
  }
}
function E(i, e, t = i, s) {
  if (e === A) return e;
  let n = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const r = P(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = n : t._$Cl = n), n !== void 0 && (e = E(i, n._$AS(i, e.values), n, s)), e;
}
class ke {
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
    const { el: { content: t }, parts: s } = this._$AD, n = (e?.creationScope ?? v).importNode(t, !0);
    b.currentNode = n;
    let r = b.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let p;
        a.type === 2 ? p = new N(r, r.nextSibling, this, e) : a.type === 1 ? p = new a.ctor(r, a.name, a.strings, this, e) : a.type === 6 && (p = new Me(r, this, e)), this._$AV.push(p), a = s[++l];
      }
      o !== a?.index && (r = b.nextNode(), o++);
    }
    return b.currentNode = v, n;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, n) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    e = E(this, e, t), P(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== A && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && P(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, n = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = M.createElement(ce(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(t);
    else {
      const r = new ke(n, this), o = r.u(this.options);
      r.p(t), this.T(o), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = te.get(e.strings);
    return t === void 0 && te.set(e.strings, t = new M(e)), t;
  }
  k(e) {
    B(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, n = 0;
    for (const r of e) n === t.length ? t.push(s = new N(this.O(C()), this.O(C()), this, this.options)) : s = t[n], s._$AI(r), n++;
    n < t.length && (this._$AR(s && s._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = Z(e).nextSibling;
      Z(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, n, r) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(e, t = this, s, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) e = E(this, e, t, 0), o = !P(e) || e !== this._$AH && e !== A, o && (this._$AH = e);
    else {
      const l = e;
      let a, p;
      for (e = r[0], a = 0; a < r.length - 1; a++) p = E(this, l[s + a], t, a), p === A && (p = this._$AH[a]), o ||= !P(p) || p !== this._$AH[a], p === c ? e = c : e !== c && (e += (p ?? "") + r[a + 1]), this._$AH[a] = p;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Se extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class Ce extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class Pe extends D {
  constructor(e, t, s, n, r) {
    super(e, t, s, n, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = E(this, e, t, 0) ?? c) === A) return;
    const s = this._$AH, n = e === c && s !== c || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== c && (s === c || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Me {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    E(this, e);
  }
}
const Ne = j.litHtmlPolyfillSupport;
Ne?.(M, N), (j.litHtmlVersions ??= []).push("3.3.3");
const Ue = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = t?.renderBefore ?? null;
    s._$litPart$ = n = new N(e.insertBefore(C(), r), r, void 0, t ?? {});
  }
  return n._$AI(i), n;
};
const I = globalThis;
class x extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ue(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
x._$litElement$ = !0, x.finalized = !0, I.litElementHydrateSupport?.({ LitElement: x });
const Te = I.litElementPolyfillSupport;
Te?.({ LitElement: x });
(I.litElementVersions ??= []).push("4.2.2");
const Oe = {
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
    invalid: "Ungültige Konfiguration"
  },
  en: {
    title: "PV payback",
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
    invalid: "Invalid configuration"
  }
}, De = {
  de: {
    start_date: "Startdatum",
    investment_cost: "Investitionskosten",
    electricity_price: "Strompreis pro kWh",
    feed_in_tariff: "Einspeisevergütung pro kWh",
    self_consumption_entity: "Entität für Eigenverbrauch",
    export_energy_entity: "Entität für Einspeisung",
    production_energy_entity: "Entität für PV-Produktion",
    self_consumption_baseline: "Ausgangswert Eigenverbrauch (kWh)",
    export_energy_baseline: "Ausgangswert Einspeisung (kWh)",
    show_breakdown: "Aufschlüsselung anzeigen",
    show_energy_values: "Energiewerte anzeigen",
    show_money_values: "Geldwerte anzeigen",
    show_payback_date: "Amortisationsdatum anzeigen",
    show_progress: "Fortschritt anzeigen",
    show_contribution_segments: "Anteile im Fortschrittsbalken getrennt anzeigen"
  },
  en: {
    start_date: "Start date",
    investment_cost: "Investment cost",
    electricity_price: "Electricity price per kWh",
    feed_in_tariff: "Feed-in tariff per kWh",
    self_consumption_entity: "Self-consumption energy entity",
    export_energy_entity: "Export energy entity",
    production_energy_entity: "PV production energy entity",
    self_consumption_baseline: "Self-consumption baseline (kWh)",
    export_energy_baseline: "Export baseline (kWh)",
    show_breakdown: "Show breakdown",
    show_energy_values: "Show energy values",
    show_money_values: "Show monetary values",
    show_payback_date: "Show payback date",
    show_progress: "Show progress",
    show_contribution_segments: "Show separate contribution segments in progress bar"
  }
};
function he(i) {
  return i === "Wh" || i === "kWh" || i === "MWh";
}
function He(i, e) {
  if (!(!Number.isFinite(i) || !he(e)))
    return e === "Wh" ? i / 1e3 : e === "MWh" ? i * 1e3 : i;
}
function Re(i) {
  return {
    ...i,
    show_breakdown: i.show_breakdown ?? !0,
    show_energy_values: i.show_energy_values ?? !0,
    show_money_values: i.show_money_values ?? !0,
    show_payback_date: i.show_payback_date ?? !0,
    show_progress: i.show_progress ?? !0,
    show_contribution_segments: i.show_contribution_segments ?? !1
  };
}
function We(i, e) {
  return !i || i === "PV-Amortisation" ? e : i;
}
function ze(i, e, t, s = /* @__PURE__ */ new Date()) {
  const n = Math.max(0, e - (i.self_consumption_baseline ?? 0)), r = Math.max(0, t - (i.export_energy_baseline ?? 0)), o = n * i.electricity_price, l = r * i.feed_in_tariff, a = o + l, p = Math.min(100, a / i.investment_cost * 100), u = /* @__PURE__ */ new Date(`${i.start_date}T00:00:00`);
  let h;
  if (a > 0 && u <= s) {
    const d = Math.max(1, (s.getTime() - u.getTime()) / 864e5);
    h = new Date(
      u.getTime() + i.investment_cost / a * d * 864e5
    );
  }
  return {
    selfConsumption: n,
    exported: r,
    ownValue: o,
    exportValue: l,
    benefit: a,
    progress: p,
    paybackDate: h
  };
}
function se(i, e) {
  const t = !!i.self_consumption_entity;
  return `pv-payback-card:last-valid:${JSON.stringify([
    t ? "direct-self-consumption" : "derived-self-consumption",
    t ? i.self_consumption_entity : i.production_energy_entity,
    i.export_energy_entity,
    i.start_date,
    i.self_consumption_baseline ?? 0,
    i.export_energy_baseline ?? 0
  ])}:${e}`;
}
function Ve(i) {
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
function je(i, e) {
  try {
    return Ve(i.getItem(e));
  } catch {
    return;
  }
}
function Be(i, e) {
  return i !== void 0 && i >= 0 ? e && i < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: i, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function Ie(i) {
  if (!i.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${i.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const e of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(i[e]) || i[e] < 0) return e;
  if (i.investment_cost <= 0) return "investment_cost";
  if (!i.export_energy_entity || !i.self_consumption_entity && !i.production_energy_entity)
    return "energy entity";
}
class Fe extends x {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  constructor() {
    super(), this._config = {};
  }
  setConfig(e) {
    this._config = { ...e };
  }
  changed(e) {
    const t = e.target, s = [
      "investment_cost",
      "electricity_price",
      "feed_in_tariff",
      "self_consumption_baseline",
      "export_energy_baseline"
    ].includes(t.name), n = t.type === "checkbox" ? t.checked : s ? Number(t.value) : t.value;
    this._config = { ...this._config, [t.name]: n }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityChanged(e, t) {
    const s = t.detail?.value;
    typeof s == "string" && (this._config = { ...this._config, [e]: s }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    ));
  }
  entityField(e, t) {
    const s = String(this._config[e] ?? "");
    return this.hass && customElements.get("ha-entity-picker") ? g`<ha-entity-picker
        .hass=${this.hass}
        .value=${s}
        .label=${t}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${!0}
        @value-changed=${(r) => this.entityChanged(e, r)}
      ></ha-entity-picker>` : g`<label
      >${t}<input name=${e} type="text" .value=${s} @change=${this.changed}
    /></label>`;
  }
  render() {
    const e = De[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
      ["start_date", e.start_date, "date"],
      ["investment_cost", e.investment_cost, "number"],
      ["electricity_price", e.electricity_price, "number"],
      ["feed_in_tariff", e.feed_in_tariff, "number"]
    ], s = [
      ["self_consumption_baseline", e.self_consumption_baseline, "number"],
      ["export_energy_baseline", e.export_energy_baseline, "number"]
    ], n = ([r, o, l]) => g`<label
        >${o}<input
          name=${r}
          type=${l}
          step="any"
          .value=${String(this._config[r] ?? "")}
          @change=${this.changed}
      /></label>`;
    return g`${t.map(
      n
    )}${this.entityField("self_consumption_entity", e.self_consumption_entity)}${this.entityField("production_energy_entity", e.production_energy_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${s.map(
      n
    )}${[
      "show_breakdown",
      "show_energy_values",
      "show_money_values",
      "show_payback_date",
      "show_progress",
      "show_contribution_segments"
    ].map(
      (r) => g`<label
          ><input
            name=${r}
            type="checkbox"
            .checked=${r === "show_contribution_segments" ? this._config[r] === !0 : this._config[r] !== !1}
            @change=${this.changed}
          />${e[r]}</label
        >`
    )}`;
  }
  static styles = ne`
    label {
      display: block;
      margin: 10px 0;
    }
    input {
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
  `;
}
customElements.define("pv-payback-card-editor", Fe);
class Le extends x {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  static getStubConfig() {
    return {
      type: "custom:pv-payback-card",
      show_breakdown: !0,
      show_energy_values: !0,
      show_money_values: !0,
      show_payback_date: !0,
      show_progress: !0,
      show_contribution_segments: !1
    };
  }
  static getConfigElement() {
    return document.createElement("pv-payback-card-editor");
  }
  setConfig(e) {
    this._config = Re(e);
  }
  getCardSize() {
    return 4;
  }
  readEnergy(e, t, s) {
    const n = this.hass?.states[t], r = n ? Number(n.state) : Number.NaN, o = He(r, n?.attributes?.unit_of_measurement), l = je(localStorage, se(e, t)), a = Be(o, l);
    if (a.value !== void 0) {
      if (!a.cached) {
        const u = JSON.stringify({
          value: a.value,
          timestamp: n?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(se(e, t), u);
        } catch {
        }
      }
      return {
        value: a.value,
        cached: a.cached,
        timestamp: a.cached ? l?.timestamp : n?.last_updated,
        warning: a.regression ? `${t}: ${s.counterRegression}` : void 0
      };
    }
    const p = n?.attributes?.unit_of_measurement;
    return {
      cached: !1,
      warning: n && !he(p) ? `${t}: ${s.unsupportedUnit}` : `${t}: ${s.entityUnavailable}`
    };
  }
  text() {
    return Oe[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
  }
  formatMoney(e) {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      style: "currency",
      currency: this._config?.currency ?? this.hass?.config?.currency ?? "EUR",
      maximumFractionDigits: 0
    }).format(e);
  }
  formatEnergy(e) {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      maximumFractionDigits: 0
    }).format(e) + " kWh";
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
  handleBreakdownKeydown(e, t) {
    e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.openMoreInfo(t));
  }
  render() {
    const e = this._config;
    if (!e) return c;
    const t = this.text(), s = Ie(e);
    if (s)
      return g`<ha-card
        ><div class="content error" role="alert">${t.invalid}: ${s}</div></ha-card
      >`;
    const n = e.self_consumption_entity ? this.readEnergy(e, e.self_consumption_entity, t) : void 0, r = !n && e.production_energy_entity ? this.readEnergy(e, e.production_energy_entity, t) : void 0, o = this.readEnergy(e, e.export_energy_entity, t), l = [n, r, o].filter(
      (_) => !!_
    ), a = n?.value, p = r?.value, u = o.value;
    if (u === void 0 || n !== void 0 && a === void 0 || r !== void 0 && p === void 0)
      return g`<ha-card
        ><div class="content error" role="alert">
          ${t.unavailable}${l.map(
        (_) => _.warning ? g`<br />${_.warning}` : c
      )}
        </div></ha-card
      >`;
    const h = a ?? p - u, d = ze(e, h, u), m = l.some((_) => _.cached), y = l.map((_) => _.timestamp).filter(Boolean).sort().at(0), H = m ? `${t.cached}${y ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(y))}` : ""}${l.filter((_) => _.warning).map((_) => ` ${_.warning}`).join("")}` : void 0, F = Math.min(
      100,
      Math.max(0, d.ownValue / e.investment_cost * 100)
    ), de = Math.min(
      Math.max(0, 100 - F),
      Math.max(0, d.exportValue / e.investment_cost * 100)
    );
    return g`<ha-card>
      <div class="content">
        <div class="header">
          <div class="header-title">
            <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
            ><span>${We(e.name, t.title)}</span>
          </div>
          <div class="header-meta">
            ${H ? g`<span
                    class="warning-indicator"
                    role="img"
                    aria-label=${H}
                    title=${H}
                    ><ha-icon icon="mdi:alert"></ha-icon
                  ></span>` : c}
            ${e.show_progress ? g`<span class="header-progress">${d.progress.toFixed(1)}%</span>` : c}
          </div>
        </div>
        <div class="benefit">
          <span>${t.benefit}</span><strong>${this.formatMoney(d.benefit)}</strong>
        </div>
        ${e.show_progress ? g`<div
                class="bar ${e.show_contribution_segments ? "contribution-segments" : ""}"
                role="progressbar"
                aria-label=${t.progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${d.progress}
              >
                ${e.show_contribution_segments ? g`<div class="contribution-own" style=${`width:${F}%`}></div>
                        <div
                          class="contribution-export"
                          style=${`width:${de}%`}
                        ></div>` : g`<div style=${`width:${d.progress}%`}></div>`}
              </div>` : c}
        ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? g`<div
                class="breakdown ${e.show_contribution_segments ? "contribution-segments" : ""}"
              >
                <div
                  class="own"
                  role=${e.self_consumption_entity ? "button" : c}
                  tabindex=${e.self_consumption_entity ? "0" : c}
                  aria-label=${e.self_consumption_entity ? t.own : c}
                  @click=${e.self_consumption_entity ? () => this.openMoreInfo(e.self_consumption_entity) : c}
                  @keydown=${e.self_consumption_entity ? (_) => this.handleBreakdownKeydown(_, e.self_consumption_entity) : c}
                >
                  <span>${t.own}</span
                  ><b
                    >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(d.selfConsumption)} · ${this.formatMoney(d.ownValue)}` : e.show_energy_values ? this.formatEnergy(d.selfConsumption) : this.formatMoney(d.ownValue)}</b
                  >
                </div>
                <div
                  class="export"
                  role="button"
                  tabindex="0"
                  aria-label=${t.export}
                  @click=${() => this.openMoreInfo(e.export_energy_entity)}
                  @keydown=${(_) => this.handleBreakdownKeydown(_, e.export_energy_entity)}
                >
                  <span>${t.export}</span
                  ><b
                    >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(d.exported)} · ${this.formatMoney(d.exportValue)}` : e.show_energy_values ? this.formatEnergy(d.exported) : this.formatMoney(d.exportValue)}</b
                  >
                </div>
              </div>` : c}
        ${e.show_payback_date ? g`<div class="date"><span>${t.expected}</span><b>${d.paybackDate ? new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, { dateStyle: "medium" }).format(d.paybackDate) : t.noProjection}</b></div>` : c}
      </div>
    </ha-card>`;
  }
  static styles = ne`
    :host {
      display: block;
    }
    .content {
      padding: 16px;
      color: var(--primary-text-color);
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
      color: var(--warning-color, #ff9800);
    }
    .warning-indicator ha-icon {
      color: inherit;
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
    .date {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin: 12px 0 6px;
    }
    .bar {
      height: 10px;
      background: var(--secondary-background-color);
      border-radius: 99px;
      overflow: hidden;
    }
    .bar div {
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
    .bar.contribution-segments div {
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
    .breakdown {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 18px;
    }
    .breakdown div {
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
    .breakdown div[role="button"] {
      cursor: pointer;
    }
    .breakdown div[role="button"]:focus-visible {
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
    .date {
      align-items: start;
      margin-top: 18px;
    }
    .date b {
      text-align: end;
    }
    .error {
      margin-top: 16px;
      color: var(--warning-color);
      font-size: 0.88em;
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
      .date b {
        text-align: start;
      }
    }
  `;
}
customElements.define("pv-payback-card", Le);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  Le as PVPaybackCard,
  Fe as PVPaybackCardEditor,
  se as cacheKey,
  ze as calculatePayback,
  Be as chooseEnergyValue,
  We as displayName,
  He as energyToKwh,
  Ve as parseCachedEnergy,
  je as readCachedEnergy,
  Re as withDisplayDefaults
};
