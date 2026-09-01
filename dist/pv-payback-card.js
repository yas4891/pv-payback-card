const B = globalThis, ie = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, se = /* @__PURE__ */ Symbol(), ue = /* @__PURE__ */ new WeakMap();
let De = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = !0, n !== se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (ie && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = ue.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ue.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ve = (i) => new De(typeof i == "string" ? i : i + "", void 0, se), Ce = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((n, s, a) => n + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[a + 1], i[0]);
  return new De(t, i, se);
}, ze = (i, e) => {
  if (ie) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const n = document.createElement("style"), s = B.litNonce;
    s !== void 0 && n.setAttribute("nonce", s), n.textContent = t.cssText, i.appendChild(n);
  }
}, he = ie ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules) t += n.cssText;
  return Ve(t);
})(i) : i;
const { is: He, defineProperty: je, getOwnPropertyDescriptor: Ke, getOwnPropertyNames: Ie, getOwnPropertySymbols: Be, getPrototypeOf: Le } = Object, J = globalThis, pe = J.trustedTypes, qe = pe ? pe.emptyScript : "", Je = J.reactiveElementPolyfillSupport, z = (i, e) => i, te = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? qe : null;
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
} }, Me = (i, e) => !He(i, e), _e = { attribute: !0, type: String, converter: te, reflect: !1, useDefault: !1, hasChanged: Me };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), J.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = _e) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const n = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, n, t);
      s !== void 0 && je(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: s, set: a } = Ke(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: s, set(o) {
      const r = s?.call(this);
      a?.call(this, o), this.requestUpdate(e, r, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? _e;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = Le(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, n = [...Ie(t), ...Be(t)];
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
      for (const s of n) t.unshift(he(s));
    } else e !== void 0 && t.push(he(e));
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
    return ze(e, this.constructor.elementStyles), e;
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
      const a = (n.converter?.toAttribute !== void 0 ? n.converter : te).toAttribute(t, n.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const n = this.constructor, s = n._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = n.getPropertyOptions(s), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : te;
      this._$Em = s;
      const r = o.fromAttribute(t, a.type);
      this[s] = r ?? this._$Ej?.get(s) ?? r, this._$Em = null;
    }
  }
  requestUpdate(e, t, n, s = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (a = this[e]), n ??= o.getPropertyOptions(e), !((n.hasChanged ?? Me)(a, t) || n.useDefault && n.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, n)))) return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: n, reflect: s, wrapped: a }, o) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), a !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [s, a] of n) {
        const { wrapped: o } = a, r = this[s];
        o !== !0 || this._$AL.has(s) || r === void 0 || this.C(s, void 0, a, r);
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
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[z("elementProperties")] = /* @__PURE__ */ new Map(), N[z("finalized")] = /* @__PURE__ */ new Map(), Je?.({ ReactiveElement: N }), (J.reactiveElementVersions ??= []).push("2.1.2");
const ae = globalThis, ge = (i) => i, q = ae.trustedTypes, me = q ? q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Ne = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Te = "?" + A, Ye = `<${Te}>`, M = document, H = () => M.createComment(""), j = (i) => i === null || typeof i != "object" && typeof i != "function", oe = Array.isArray, Ze = (i) => oe(i) || typeof i?.[Symbol.iterator] == "function", X = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ye = /-->/g, fe = />/g, D = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, be = /"/g, Pe = /^(?:script|style|textarea|title)$/i, Ge = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), f = Ge(1), O = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), $e = /* @__PURE__ */ new WeakMap(), C = M.createTreeWalker(M, 129);
function Oe(i, e) {
  if (!oe(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return me !== void 0 ? me.createHTML(e) : e;
}
const Xe = (i, e) => {
  const t = i.length - 1, n = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = U;
  for (let r = 0; r < t; r++) {
    const c = i[r];
    let l, u, d = -1, p = 0;
    for (; p < c.length && (o.lastIndex = p, u = o.exec(c), u !== null); ) p = o.lastIndex, o === U ? u[1] === "!--" ? o = ye : u[1] !== void 0 ? o = fe : u[2] !== void 0 ? (Pe.test(u[2]) && (s = RegExp("</" + u[2], "g")), o = D) : u[3] !== void 0 && (o = D) : o === D ? u[0] === ">" ? (o = s ?? U, d = -1) : u[1] === void 0 ? d = -2 : (d = o.lastIndex - u[2].length, l = u[1], o = u[3] === void 0 ? D : u[3] === '"' ? be : ve) : o === be || o === ve ? o = D : o === ye || o === fe ? o = U : (o = D, s = void 0);
    const _ = o === D && i[r + 1].startsWith("/>") ? " " : "";
    a += o === U ? c + Ye : d >= 0 ? (n.push(l), c.slice(0, d) + Ne + c.slice(d) + A + _) : c + A + (d === -2 ? r : _);
  }
  return [Oe(i, a + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class K {
  constructor({ strings: e, _$litType$: t }, n) {
    let s;
    this.parts = [];
    let a = 0, o = 0;
    const r = e.length - 1, c = this.parts, [l, u] = Xe(e, t);
    if (this.el = K.createElement(l, n), C.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = C.nextNode()) !== null && c.length < r; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Ne)) {
          const p = u[o++], _ = s.getAttribute(d).split(A), g = /([.?@])?(.*)/.exec(p);
          c.push({ type: 1, index: a, name: g[2], strings: _, ctor: g[1] === "." ? et : g[1] === "?" ? tt : g[1] === "@" ? nt : Y }), s.removeAttribute(d);
        } else d.startsWith(A) && (c.push({ type: 6, index: a }), s.removeAttribute(d));
        if (Pe.test(s.tagName)) {
          const d = s.textContent.split(A), p = d.length - 1;
          if (p > 0) {
            s.textContent = q ? q.emptyScript : "";
            for (let _ = 0; _ < p; _++) s.append(d[_], H()), C.nextNode(), c.push({ type: 2, index: ++a });
            s.append(d[p], H());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Te) c.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(A, d + 1)) !== -1; ) c.push({ type: 7, index: a }), d += A.length - 1;
      }
      a++;
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
  const a = j(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(i), s._$AT(i, t, n)), n !== void 0 ? (t._$Co ??= [])[n] = s : t._$Cl = s), s !== void 0 && (e = W(i, s._$AS(i, e.values), s, n)), e;
}
class Qe {
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
    let a = C.nextNode(), o = 0, r = 0, c = n[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let l;
        c.type === 2 ? l = new I(a, a.nextSibling, this, e) : c.type === 1 ? l = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (l = new it(a, this, e)), this._$AV.push(l), c = n[++r];
      }
      o !== c?.index && (a = C.nextNode(), o++);
    }
    return C.currentNode = M, s;
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), t += n.strings.length - 2) : n._$AI(e[t])), t++;
  }
}
class I {
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
    e = W(this, e, t), j(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ze(e) ? this.k(e) : this._(e);
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
    const { values: t, _$litType$: n } = e, s = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = K.createElement(Oe(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const a = new Qe(s, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = $e.get(e.strings);
    return t === void 0 && $e.set(e.strings, t = new K(e)), t;
  }
  k(e) {
    oe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, s = 0;
    for (const a of e) s === t.length ? t.push(n = new I(this.O(H()), this.O(H()), this, this.options)) : n = t[s], n._$AI(a), s++;
    s < t.length && (this._$AR(n && n._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const n = ge(e).nextSibling;
      ge(e).remove(), e = n;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Y {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, s, a) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = a, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = h;
  }
  _$AI(e, t = this, n, s) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = W(this, e, t, 0), o = !j(e) || e !== this._$AH && e !== O, o && (this._$AH = e);
    else {
      const r = e;
      let c, l;
      for (e = a[0], c = 0; c < a.length - 1; c++) l = W(this, r[n + c], t, c), l === O && (l = this._$AH[c]), o ||= !j(l) || l !== this._$AH[c], l === h ? e = h : e !== h && (e += (l ?? "") + a[c + 1]), this._$AH[c] = l;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class et extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class tt extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class nt extends Y {
  constructor(e, t, n, s, a) {
    super(e, t, n, s, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = W(this, e, t, 0) ?? h) === O) return;
    const n = this._$AH, s = e === h && n !== h || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, a = e !== h && (n === h || s);
    s && this.element.removeEventListener(this.name, this, n), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class it {
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
const st = ae.litHtmlPolyfillSupport;
st?.(K, I), (ae.litHtmlVersions ??= []).push("3.3.3");
const at = (i, e, t) => {
  const n = t?.renderBefore ?? e;
  let s = n._$litPart$;
  if (s === void 0) {
    const a = t?.renderBefore ?? null;
    n._$litPart$ = s = new I(e.insertBefore(H(), a), a, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
const re = globalThis;
class T extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = at(t, this.renderRoot, this.renderOptions);
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
T._$litElement$ = !0, T.finalized = !0, re.litElementHydrateSupport?.({ LitElement: T });
const ot = re.litElementPolyfillSupport;
ot?.({ LitElement: T });
(re.litElementVersions ??= []).push("4.2.2");
const rt = 365.2425, ct = 366 * 50, we = 180 * 1e3, xe = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), lt = {
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
}, dt = {
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
};
function V(i) {
  return i === "Wh" || i === "kWh" || i === "MWh";
}
function ne(i, e) {
  if (!(!Number.isFinite(i) || !V(e)))
    return e === "Wh" ? i / 1e3 : e === "MWh" ? i * 1e3 : i;
}
function ut(i) {
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
function ce(i) {
  return i.apply_annual_discount ?? i.use_historical_statistics ?? !1;
}
function Ae(i, e) {
  return !i || i === "PV-Amortisation" ? e : i;
}
function ht(i, e, t, n) {
  if (t <= 0 || i > e) return;
  const s = Math.max(1, (e.getTime() - i.getTime()) / 864e5);
  return new Date(i.getTime() + n / t * s * 864e5);
}
function x(i) {
  return new Date(i.getFullYear(), i.getMonth(), i.getDate());
}
function P(i, e) {
  const t = new Date(i.getFullYear(), 0, 0), n = Math.round((x(i).getTime() - t.getTime()) / 864e5), s = e * Math.PI / 180, a = 0.409 * Math.sin(2 * Math.PI * n / 365 - 1.39), o = -Math.tan(s) * Math.tan(a), r = Math.acos(Math.max(-1, Math.min(1, o))), c = r * Math.sin(s) * Math.sin(a) + Math.cos(s) * Math.cos(a) * Math.sin(r);
  return Math.max(0, c);
}
function pt(i, e, t, n, s) {
  const a = /* @__PURE__ */ new Date(`${i}T00:00:00`);
  if (Number.isNaN(a.getTime()) || !Number.isFinite(e.getTime()) || !Number.isFinite(t) || t <= 0 || !Number.isFinite(n) || n <= 0 || !Number.isFinite(s) || s < -90 || s > 90 || a > e)
    return;
  const o = x(e);
  let r = 0;
  for (let _ = x(a); _ <= o; _.setDate(_.getDate() + 1))
    r += P(_, s);
  if (!Number.isFinite(r) || r <= 0) return;
  const c = t / r, l = Math.max(1e-9, n * Number.EPSILON * 16);
  if (t >= n) {
    let _ = 0;
    for (let g = x(a); g <= o; g.setDate(g.getDate() + 1))
      if (_ += P(g, s) * c, _ >= n - l) return new Date(g);
    return;
  }
  let u = t;
  const d = new Date(o), p = 366 * 50;
  for (let _ = 0; _ < p; _ += 1) {
    if (u >= n - l) return new Date(d);
    d.setDate(d.getDate() + 1), u += P(d, s) * c;
  }
}
function Z(i, e) {
  return typeof i == "number" && Number.isFinite(i) && i >= -90 && i <= 90 && typeof e == "number" && Number.isFinite(e) && e >= -180 && e <= 180;
}
function k(i) {
  return [
    i.getFullYear(),
    String(i.getMonth() + 1).padStart(2, "0"),
    String(i.getDate()).padStart(2, "0")
  ].join("-");
}
function Q(i, e, t) {
  const n = Math.max(
    0,
    (x(i).getTime() - x(e).getTime()) / 864e5
  );
  return 1 / (1 + t / 100) ** (n / rt);
}
function _t(i) {
  const e = i.start ?? i.start_time;
  if (typeof e == "number")
    return !Number.isFinite(e) || Number.isNaN(new Date(e).getTime()) ? void 0 : k(new Date(e));
  if (!(typeof e != "string" || Number.isNaN(new Date(e).getTime())))
    return e.slice(0, 10);
}
function ee(i) {
  const e = /* @__PURE__ */ new Map();
  let t;
  for (const n of i ?? []) {
    const s = _t(n), a = typeof n.sum == "number" ? n.sum : Number.NaN;
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
function ke(i, e) {
  const t = ee(e?.[i.export_energy_entity]), n = i.self_consumption_entity ? ee(e?.[i.self_consumption_entity]) : void 0, s = i.production_energy_entity ? ee(e?.[i.production_energy_entity]) : void 0;
  return [.../* @__PURE__ */ new Set([
    ...t.keys(),
    ...n?.keys() ?? [],
    ...s?.keys() ?? []
  ])].sort().flatMap((o) => {
    const r = t.get(o);
    if (r === void 0) return [];
    const c = n ? n.get(o) : s?.get(o) === void 0 ? void 0 : Math.max(0, s.get(o) - r);
    return c === void 0 || !Number.isFinite(c) || c < 0 ? [] : [{ date: o, selfConsumption: c, exported: r }];
  });
}
function We(i, e) {
  const t = i.self_consumption_entity ? ["direct", i.self_consumption_entity, i.export_energy_entity] : ["derived", i.production_energy_entity, i.export_energy_entity];
  return JSON.stringify([t, i.start_date, e]);
}
function gt(i, e, t = /* @__PURE__ */ new Date()) {
  if (!i.callWS || !ce(e) || (e.annual_discount_rate ?? 0) <= 0)
    return;
  const n = /* @__PURE__ */ new Date(`${e.start_date}T00:00:00`);
  if (Number.isNaN(n.getTime()) || Number.isNaN(t.getTime())) return;
  const s = x(n);
  s.setDate(s.getDate() - 1);
  const a = x(t), o = x(t);
  o.setDate(o.getDate() - 1);
  const r = k(o), c = We(e, r), l = xe.get(c);
  if (l) return l;
  const u = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity], d = i.callWS({
    type: "recorder/statistics_during_period",
    start_time: `${k(s)}T00:00:00`,
    end_time: `${k(a)}T00:00:00`,
    statistic_ids: u,
    period: "day",
    types: ["sum"]
  }).then(
    (p) => p && typeof p == "object" ? p : void 0
  ).catch(() => {
  });
  return xe.set(c, d), d;
}
function mt(i, e, t, n) {
  const s = i.use_location_seasonality && Z(n?.latitude, n?.longitude), a = [];
  for (let r = x(e); r <= x(t); r.setDate(r.getDate() + 1))
    a.push({
      date: new Date(r),
      weight: s ? P(r, n.latitude) : 1
    });
  return a.reduce((r, c) => r + c.weight, 0) > 0 ? a : a.map((r) => ({ ...r, weight: 1 }));
}
function yt(i, e, t, n, s, a) {
  const o = /* @__PURE__ */ new Date(`${i.start_date}T00:00:00`);
  if (Number.isNaN(o.getTime()) || o > n) return [];
  const r = mt(i, o, n, s), c = new Map((a ?? []).map((p) => [p.date, p])), l = (p, _) => {
    const g = r.map(
      ({ date: w }) => Math.max(0, c.get(k(w))?.[_] ?? 0)
    ), $ = g.reduce((w, b) => w + b, 0), v = r.reduce(
      (w, b, E) => w + (g[E] > 0 ? 0 : b.weight),
      0
    ), m = r.map((w, b) => $ > 0 && g[b] > 0 ? g[b] : v > 0 ? p * w.weight / v : 0), S = m.reduce((w, b) => w + b, 0);
    return S > 0 ? m.map((w) => w * p / S) : m;
  }, u = l(Math.max(0, e), "selfConsumption"), d = l(Math.max(0, t), "exported");
  return r.map((p, _) => ({
    date: k(p.date),
    selfConsumption: u[_],
    exported: d[_]
  }));
}
function ft(i, e, t, n) {
  const s = /* @__PURE__ */ new Date(`${i.start_date}T00:00:00`), a = i.annual_discount_rate ?? 0;
  let o = 0, r = 0, c = 0, l;
  for (const $ of t) {
    const v = /* @__PURE__ */ new Date(`${$.date}T00:00:00`), m = $.selfConsumption * i.electricity_price * Q(v, s, a), S = $.exported * i.feed_in_tariff * Q(v, s, a);
    o += m, r += S, c += m + S, !l && c >= i.investment_cost && (l = v);
  }
  if (l) return { ownValue: o, exportValue: r, paybackDate: l };
  const u = i.use_location_seasonality && Z(n?.latitude, n?.longitude), d = t.reduce(
    ($, v) => $ + (u ? P(/* @__PURE__ */ new Date(`${v.date}T00:00:00`), n.latitude) : 1),
    0
  ), p = t.reduce(
    ($, v) => $ + v.selfConsumption * i.electricity_price + v.exported * i.feed_in_tariff,
    0
  );
  if (d <= 0 || p <= 0) return { ownValue: o, exportValue: r };
  const _ = p / d, g = x(e);
  for (let $ = 0; $ < ct; $ += 1) {
    g.setDate(g.getDate() + 1);
    const v = u ? P(g, n.latitude) : 1;
    if (c += _ * v * Q(g, s, a), c >= i.investment_cost)
      return { ownValue: o, exportValue: r, paybackDate: new Date(g) };
  }
  return { ownValue: o, exportValue: r };
}
function L(i, e, t, n = /* @__PURE__ */ new Date(), s, a) {
  const o = Math.max(0, t - (i.export_energy_baseline ?? 0)), r = i.self_consumption_entity ? Math.max(0, e - (i.self_consumption_baseline ?? 0)) : Math.max(
    0,
    e - (i.production_energy_baseline ?? 0) - o
  ), c = r * i.electricity_price, l = o * i.feed_in_tariff;
  if (ce(i) && (i.annual_discount_rate ?? 0) > 0) {
    const w = yt(
      i,
      r,
      o,
      n,
      s,
      a
    ), b = ft(i, n, w, s), E = b.ownValue + b.exportValue;
    return {
      selfConsumption: r,
      exported: o,
      ownValue: b.ownValue,
      exportValue: b.exportValue,
      benefit: E,
      progress: Math.min(100, E / i.investment_cost * 100),
      paybackDate: b.paybackDate
    };
  }
  const u = c, d = l, p = u + d, _ = Math.min(100, p / i.investment_cost * 100), g = /* @__PURE__ */ new Date(`${i.start_date}T00:00:00`), $ = ht(g, n, p, i.investment_cost), v = s?.latitude, m = s?.longitude, S = i.use_location_seasonality && Z(v, m) ? pt(
    i.start_date,
    n,
    p,
    i.investment_cost,
    v
  ) ?? $ : $;
  return {
    selfConsumption: r,
    exported: o,
    ownValue: u,
    exportValue: d,
    benefit: p,
    progress: _,
    paybackDate: S
  };
}
function vt(i, e, t, n = /* @__PURE__ */ new Date(), s, a, o = i.annual_discount_rate ?? 3) {
  const r = {
    ...i,
    apply_annual_discount: !1,
    use_historical_statistics: !1
  };
  return {
    linear: L(
      { ...r, use_location_seasonality: !1, annual_discount_rate: 0 },
      e,
      t,
      n,
      s,
      a
    ),
    seasonal: L(
      { ...r, use_location_seasonality: !0, annual_discount_rate: 0 },
      e,
      t,
      n,
      s,
      a
    ),
    discounted: L(
      {
        ...r,
        use_location_seasonality: !0,
        annual_discount_rate: o,
        apply_annual_discount: !0
      },
      e,
      t,
      n,
      s,
      a
    )
  };
}
function F(i, e) {
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
function bt(i, e) {
  if (i)
    for (let t = i.length - 1; t >= 0; t -= 1) {
      const n = i[t], s = n.s ?? n.state;
      if (typeof s == "string" && s.trim() === "" || s === null || s === void 0)
        continue;
      const a = typeof s == "number" ? s : Number(s), o = ne(a, e);
      if (o === void 0 || o < 0) continue;
      const r = typeof n.last_updated == "string" ? n.last_updated : typeof n.lu == "number" && Number.isFinite(n.lu) ? new Date(n.lu * 1e3).toISOString() : void 0;
      return { value: o, timestamp: r };
    }
}
function $t(i, e, t = /* @__PURE__ */ new Date()) {
  const n = Object.keys(e).sort();
  if (!i.callWS || n.length === 0 || Number.isNaN(t.getTime())) return;
  const s = Math.floor(t.getTime() / (300 * 1e3)), a = JSON.stringify([n, s]), o = Se.get(a);
  if (o) return o;
  const r = new Date(t.getTime() - 1440 * 60 * 1e3), c = i.callWS({
    type: "history/history_during_period",
    start_time: r.toISOString(),
    end_time: t.toISOString(),
    entity_ids: n,
    include_start_time_state: !0,
    significant_changes_only: !0,
    minimal_response: !0,
    no_attributes: !0
  }).then((l) => {
    if (!l || typeof l != "object") return {};
    const u = l;
    return Object.fromEntries(
      n.flatMap((d) => {
        const p = bt(u[d], e[d]);
        return p ? [[d, p]] : [];
      })
    );
  }).catch(() => ({}));
  return Se.set(a, c), c;
}
function wt(i) {
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
function Ee(i, e) {
  try {
    return wt(i.getItem(e));
  } catch {
    return;
  }
}
function xt(i, e) {
  return i !== void 0 && i >= 0 ? e && i < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: i, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function St(i) {
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
class At extends T {
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
    ].includes(t.name), s = t.type === "checkbox" ? t.checked : n ? Number(t.value) : t.value;
    this._config = { ...this._config, [t.name]: s }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityChanged(e, t) {
    const n = t.detail?.value, s = typeof n == "string" ? n.trim() : "", a = { ...this._config };
    s ? a[e] = s : delete a[e], this._config = a, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityField(e, t) {
    const n = String(this._config[e] ?? "");
    return this.hass && customElements.get("ha-entity-picker") ? f`<ha-entity-picker
        .hass=${this.hass}
        .value=${n}
        .label=${t}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${!0}
        @value-changed=${(a) => this.entityChanged(e, a)}
      ></ha-entity-picker>` : f`<label
      >${t}<input name=${e} type="text" .value=${n} @change=${this.changed}
    /></label>`;
  }
  render() {
    const e = dt[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
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
    ], a = ([r, c, l]) => f`<label
        >${c}<input
          name=${r}
          type=${l}
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
    )}${this.entityField("production_energy_entity", e.production_energy_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${n.map(
      a
    )}<label
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
              ${o("show_payback_date")} ${o("show_progress")}
              ${o("use_location_seasonality")} ${o("apply_annual_discount")}
            </section>` : h}`;
  }
  static styles = Ce`
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
  `;
}
customElements.define("pv-payback-card-editor", At);
class kt extends T {
  static properties = {
    hass: { attribute: !1 },
    _config: { state: !0 },
    _scenarioDialogOpen: { state: !0 },
    _warningDialogMessage: { state: !0 }
  };
  constructor() {
    super(), this._scenarioDialogOpen = !1;
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
    this._comparisonDiscountRate = e.annual_discount_rate ?? 3, this._comparisonUsesDefaultRate = e.annual_discount_rate === void 0, this._config = ut(e), this._historicalStatistics = void 0, this._historicalStatisticsKey = void 0, this._historyRecoveryKey = void 0, this._calculationCache = void 0, this._scenarioCalculationCache = void 0, this.resetWarningDelay();
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
  disconnectedCallback() {
    super.disconnectedCallback(), this.resetWarningDelay();
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
    const a = n.filter(
      (r) => t - this._warningStartedAt.get(r.issueKey) >= we
    ), o = n.map((r) => we - (t - this._warningStartedAt.get(r.issueKey))).filter((r) => r > 0);
    return this._warningTimer !== void 0 && clearTimeout(this._warningTimer), this._warningTimer = void 0, o.length > 0 && (this._warningTimer = setTimeout(
      () => {
        this._warningTimer = void 0, this.requestUpdate();
      },
      Math.min(...o)
    )), a;
  }
  updated() {
    const e = this._config;
    if (!(!e || !this.hass?.callWS)) {
      if (ce(e) && (e.annual_discount_rate ?? 0) > 0) {
        const t = x(/* @__PURE__ */ new Date());
        t.setDate(t.getDate() - 1);
        const n = We(e, k(t));
        this._historicalStatisticsKey !== n && (this._historicalStatisticsKey = n, gt(this.hass, e)?.then((s) => {
          s && this._historicalStatisticsKey === n && (this._historicalStatistics = s, this.requestUpdate());
        }));
      }
      this.recoverMissingEnergyFromHistory(e);
    }
  }
  recoverMissingEnergyFromHistory(e) {
    if (!this.hass?.callWS) return;
    const t = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity].filter(
      (a) => !!a
    ), n = {};
    for (const a of t) {
      const o = this.hass.states[a], r = o?.attributes?.unit_of_measurement;
      if (!V(r)) continue;
      const c = Number(o.state), l = ne(c, r), u = Ee(localStorage, F(e, a));
      l === void 0 && u === void 0 && (n[a] = r);
    }
    const s = JSON.stringify(
      Object.keys(n).sort().map((a) => F(e, a))
    );
    Object.keys(n).length === 0 || this._historyRecoveryKey === s || (this._historyRecoveryKey = s, $t(this.hass, n)?.then((a) => {
      if (this._historyRecoveryKey === s) {
        for (const [o, r] of Object.entries(a))
          try {
            localStorage.setItem(F(e, o), JSON.stringify(r));
          } catch {
          }
        Object.keys(a).length > 0 && this.requestUpdate();
      }
    }));
  }
  getCardSize() {
    return 4;
  }
  readEnergy(e, t, n) {
    const s = this.hass?.states[t], a = s ? Number(s.state) : Number.NaN, o = ne(a, s?.attributes?.unit_of_measurement), r = Ee(localStorage, F(e, t)), c = xt(o, r), l = s?.attributes?.unit_of_measurement, u = s && !V(l) ? n.unsupportedUnit : n.entityUnavailable;
    if (c.value !== void 0) {
      if (!c.cached) {
        const d = JSON.stringify({
          value: c.value,
          timestamp: s?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(F(e, t), d);
        } catch {
        }
      }
      return {
        value: c.value,
        cached: c.cached,
        timestamp: c.cached ? r?.timestamp : s?.last_updated,
        warning: c.regression ? `${t}: ${n.counterRegression}` : c.cached ? `${t}: ${u}` : void 0,
        issueKey: c.cached ? `${t}:${c.regression ? "regression" : "unavailable"}` : void 0
      };
    }
    return {
      cached: !1,
      issueKey: `${t}:${s && !V(l) ? "unsupported-unit" : "unavailable"}`,
      warning: s && !V(l) ? `${t}: ${n.unsupportedUnit}` : `${t}: ${n.entityUnavailable}`
    };
  }
  text() {
    return lt[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
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
  handleScenarioKeydown(e) {
    e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.openScenarioDialog());
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
    ], a = [
      t ? void 0 : n.locationFallback,
      s.some(({ scenario: o }) => !o.paybackDate) ? n.noProjection : void 0
    ].filter((o) => o !== void 0);
    return f`<ha-dialog
      .open=${this._scenarioDialogOpen}
      .heading=${n.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${a.length > 0 ? f`<div class="scenario-warning">
                ${this.renderWarningIndicator(a.join(`
`))}
              </div>` : h}
        ${s.map(
      ({ name: o, scenario: r, icon: c, className: l }, u) => f`<section class=${`scenario ${l}`}>
              <div class="scenario-heading">
                <ha-icon .icon=${c}></ha-icon>
                <h3>${o}</h3>
              </div>
              ${u === 2 ? f`<div class="scenario-rate">
                      ${n.discountRate}: ${this.formatPercentage(this._comparisonDiscountRate)}
                      ${this._comparisonUsesDefaultRate ? f`(${n.defaultRate})` : h}
                    </div>` : h}
              <div class="scenario-values">
                <div>
                  <span>${n.benefit}</span><strong>${this.formatMoney(r.benefit)}</strong>
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
    if (!this._warningDialogMessage) return h;
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
    const t = this._config, n = this.text();
    return f`<ha-card>
        <div class="content status-only">
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${t.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${Ae(t.name, n.title)}</span>
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
  handleBreakdownKeydown(e, t) {
    e.key !== "Enter" && e.key !== " " || (e.preventDefault(), this.openMoreInfo(t));
  }
  render() {
    const e = this._config;
    if (!e) return h;
    const t = this.text(), n = St(e);
    if (n) {
      const y = this.persistentWarningReadings([
        {
          cached: !1,
          issueKey: `configuration:${n}`,
          warning: `${t.invalid}: ${n}`
        }
      ]);
      return this.renderStatusCard(y[0]?.warning);
    }
    const s = e.self_consumption_entity ? this.readEnergy(e, e.self_consumption_entity, t) : void 0, a = !s && e.production_energy_entity ? this.readEnergy(e, e.production_energy_entity, t) : void 0, o = this.readEnergy(e, e.export_energy_entity, t), r = [s, a, o].filter(
      (y) => !!y
    );
    let c = this.persistentWarningReadings(r);
    const l = s?.value, u = a?.value, d = o.value;
    if (d === void 0 || s !== void 0 && l === void 0 || a !== void 0 && u === void 0) {
      const y = c.length > 0 ? `${t.unavailable}${c.filter((G) => G.warning).map((G) => ` ${G.warning}`).join("")}` : void 0;
      return this.renderStatusCard(y);
    }
    const p = l ?? u, _ = /* @__PURE__ */ new Date(), g = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude
    }, $ = this._historicalStatistics ? `loaded:${this._historicalStatisticsKey ?? ""}` : `approximation:${this._historicalStatisticsKey ?? ""}`, v = JSON.stringify([
      e,
      p,
      d,
      k(_),
      g,
      $
    ]);
    this._calculationCache?.key !== v && (this._calculationCache = {
      key: v,
      calculation: L(
        e,
        p,
        d,
        _,
        g,
        ke(e, this._historicalStatistics)
      )
    });
    const m = this._calculationCache.calculation, S = e.show_payback_date && !m.paybackDate ? {
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
      const y = `${v}:${this._comparisonDiscountRate}`;
      this._scenarioCalculationCache?.key !== y && (this._scenarioCalculationCache = {
        key: y,
        scenarios: vt(
          e,
          p,
          d,
          _,
          g,
          ke(e, this._historicalStatistics),
          this._comparisonDiscountRate
        )
      }), w = this._scenarioCalculationCache.scenarios;
    }
    const b = c.filter(
      (y) => y.issueKey !== "projection:no-positive-benefit"
    ), E = b.map((y) => y.timestamp).filter(Boolean).sort().at(0), Re = b.length > 0 ? `${t.cached}${E ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(E))}` : ""}${b.filter((y) => y.warning).map((y) => ` ${y.warning}`).join("")}` : void 0, Ue = c.some(
      (y) => y.issueKey === "projection:no-positive-benefit"
    ) ? t.noProjection : void 0, le = [Re, Ue].filter((y) => !!y).join(`
`), de = Math.min(
      100,
      Math.max(0, m.ownValue / e.investment_cost * 100)
    ), Fe = Math.min(
      Math.max(0, 100 - de),
      Math.max(0, m.exportValue / e.investment_cost * 100)
    ), R = e.display_style === "compact";
    return f`<ha-card>
        <div class=${`content ${R ? "compact" : "full"}`}>
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${Ae(e.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${le ? this.renderWarningIndicator(le) : h}
              ${e.show_progress ? f`<span class="header-progress">${m.progress.toFixed(1)}%</span>` : h}
            </div>
          </div>
          <div class="benefit" title=${R ? t.benefit : h}>
            <span>${t.benefit}</span
            ><strong
              class="scenario-trigger"
              role="button"
              tabindex="0"
              aria-label=${`${t.scenariosOpen}: ${t.benefit}`}
              @click=${this.openScenarioDialog}
              @keydown=${this.handleScenarioKeydown}
              >${this.formatMoney(m.benefit)}</strong
            >
          </div>
          ${e.show_progress ? f`<div
                  class="bar ${e.show_contribution_segments ? "contribution-segments" : ""}"
                  role="progressbar"
                  aria-label=${t.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow=${m.progress}
                >
                  ${e.show_contribution_segments ? f`<div
                            class="contribution-own"
                            style=${`width:${de}%`}
                          ></div>
                          <div
                            class="contribution-export"
                            style=${`width:${Fe}%`}
                          ></div>` : f`<div style=${`width:${m.progress}%`}></div>`}
                </div>` : h}
          ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? f`<div
                  class="breakdown ${e.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <div
                    class="own"
                    role=${e.self_consumption_entity ? "button" : h}
                    tabindex=${e.self_consumption_entity ? "0" : h}
                    aria-label=${t.own}
                    title=${R ? t.own : h}
                    @click=${e.self_consumption_entity ? () => this.openMoreInfo(e.self_consumption_entity) : h}
                    @keydown=${e.self_consumption_entity ? (y) => this.handleBreakdownKeydown(y, e.self_consumption_entity) : h}
                  >
                    <span>${t.own}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(m.selfConsumption)} · ${this.formatMoney(m.ownValue)}` : e.show_energy_values ? this.formatEnergy(m.selfConsumption) : this.formatMoney(m.ownValue)}</b
                    >
                  </div>
                  <div
                    class="export"
                    role="button"
                    tabindex="0"
                    aria-label=${t.export}
                    title=${R ? t.export : h}
                    @click=${() => this.openMoreInfo(e.export_energy_entity)}
                    @keydown=${(y) => this.handleBreakdownKeydown(y, e.export_energy_entity)}
                  >
                    <span>${t.export}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(m.exported)} · ${this.formatMoney(m.exportValue)}` : e.show_energy_values ? this.formatEnergy(m.exported) : this.formatMoney(m.exportValue)}</b
                    >
                  </div>
                </div>` : h}
          ${e.show_payback_date ? f`<div class="date" title=${R ? t.expected : h}>
                  <span>${t.expected}</span
                  ><b
                    class="scenario-trigger"
                    role="button"
                    tabindex="0"
                    aria-label=${`${t.scenariosOpen}: ${t.expected}`}
                    @click=${this.openScenarioDialog}
                    @keydown=${this.handleScenarioKeydown}
                    >${this.formatDate(m.paybackDate)}</b
                  >
                </div>` : h}
        </div>
      </ha-card>
      ${this._scenarioDialogOpen && w ? this.renderScenarioDialog(
      w,
      Z(g.latitude, g.longitude)
    ) : h}
      ${this.renderWarningDialog()}`;
  }
  static styles = Ce`
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
    .scenario-trigger {
      border-radius: 4px;
      cursor: pointer;
    }
    .scenario-trigger:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 4px;
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
    .compact .bar {
      grid-row: 3;
      grid-column: 1 / -1;
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
    .compact .date {
      grid-row: 2;
      grid-column: 2;
      align-items: baseline;
      justify-content: flex-end;
      min-width: 0;
      margin: 16px 0 10px;
    }
    .compact .date b {
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
      .date b {
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
      .content.compact .date b {
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
  `;
}
customElements.define("pv-payback-card", kt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  kt as PVPaybackCard,
  At as PVPaybackCardEditor,
  ce as appliesAnnualDiscount,
  F as cacheKey,
  L as calculatePayback,
  vt as calculateScenarioComparisons,
  pt as calculateSeasonalPaybackDate,
  xt as chooseEnergyValue,
  ke as dailyEnergyFromStatistics,
  Ae as displayName,
  yt as distributeHistoricalEnergy,
  ne as energyToKwh,
  We as historicalStatisticsCacheKey,
  bt as latestValidEnergyFromHistory,
  gt as loadHistoricalStatistics,
  $t as loadLastValidEnergyHistory,
  wt as parseCachedEnergy,
  Ee as readCachedEnergy,
  ee as statisticDailyDeltas,
  ut as withDisplayDefaults
};
