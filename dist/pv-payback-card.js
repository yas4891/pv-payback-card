const N = globalThis, D = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, W = /* @__PURE__ */ Symbol(), F = /* @__PURE__ */ new WeakMap();
let ee = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== W) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (D && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = F.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && F.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const le = (n) => new ee(typeof n == "string" ? n : n + "", void 0, W), te = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((s, i, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new ee(t, n, W);
}, ce = (n, e) => {
  if (D) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = N.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, n.appendChild(s);
  }
}, I = D ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return le(t);
})(n) : n;
const { is: he, defineProperty: de, getOwnPropertyDescriptor: pe, getOwnPropertyNames: ue, getOwnPropertySymbols: _e, getPrototypeOf: ge } = Object, T = globalThis, L = T.trustedTypes, fe = L ? L.emptyScript : "", $e = T.reactiveElementPolyfillSupport, x = (n, e) => n, R = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? fe : null;
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
} }, se = (n, e) => !he(n, e), B = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: se };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), T.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let v = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = B) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && de(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: r } = pe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: i, set(a) {
      const l = i?.call(this);
      r?.call(this, a), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? B;
  }
  static _$Ei() {
    if (this.hasOwnProperty(x("elementProperties"))) return;
    const e = ge(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(x("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
      const t = this.properties, s = [...ue(t), ..._e(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(I(i));
    } else e !== void 0 && t.push(I(e));
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
    return ce(e, this.constructor.elementStyles), e;
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
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : R).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : R;
      this._$Em = i;
      const l = a.fromAttribute(t, r.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, r) {
    if (e !== void 0) {
      const a = this.constructor;
      if (i === !1 && (r = this[e]), s ??= a.getPropertyOptions(e), !((s.hasChanged ?? se)(r, t) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: r }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), r !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, r] of s) {
        const { wrapped: a } = r, l = this[i];
        a !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, r, l);
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[x("elementProperties")] = /* @__PURE__ */ new Map(), v[x("finalized")] = /* @__PURE__ */ new Map(), $e?.({ ReactiveElement: v }), (T.reactiveElementVersions ??= []).push("2.1.2");
const z = globalThis, q = (n) => n, M = z.trustedTypes, J = M ? M.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ie = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, ne = "?" + f, me = `<${ne}>`, y = document, S = () => y.createComment(""), k = (n) => n === null || typeof n != "object" && typeof n != "function", V = Array.isArray, ye = (n) => V(n) || typeof n?.[Symbol.iterator] == "function", H = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, K = /-->/g, Z = />/g, $ = RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), G = /'/g, Q = /"/g, re = /^(?:script|style|textarea|title)$/i, ve = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), u = ve(1), w = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), X = /* @__PURE__ */ new WeakMap(), m = y.createTreeWalker(y, 129);
function ae(n, e) {
  if (!V(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return J !== void 0 ? J.createHTML(e) : e;
}
const be = (n, e) => {
  const t = n.length - 1, s = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = E;
  for (let l = 0; l < t; l++) {
    const o = n[l];
    let d, p, c = -1, _ = 0;
    for (; _ < o.length && (a.lastIndex = _, p = a.exec(o), p !== null); ) _ = a.lastIndex, a === E ? p[1] === "!--" ? a = K : p[1] !== void 0 ? a = Z : p[2] !== void 0 ? (re.test(p[2]) && (i = RegExp("</" + p[2], "g")), a = $) : p[3] !== void 0 && (a = $) : a === $ ? p[0] === ">" ? (a = i ?? E, c = -1) : p[1] === void 0 ? c = -2 : (c = a.lastIndex - p[2].length, d = p[1], a = p[3] === void 0 ? $ : p[3] === '"' ? Q : G) : a === Q || a === G ? a = $ : a === K || a === Z ? a = E : (a = $, i = void 0);
    const g = a === $ && n[l + 1].startsWith("/>") ? " " : "";
    r += a === E ? o + me : c >= 0 ? (s.push(d), o.slice(0, c) + ie + o.slice(c) + f + g) : o + f + (c === -2 ? l : g);
  }
  return [ae(n, r + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class C {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let r = 0, a = 0;
    const l = e.length - 1, o = this.parts, [d, p] = be(e, t);
    if (this.el = C.createElement(d, s), m.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = m.nextNode()) !== null && o.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(ie)) {
          const _ = p[a++], g = i.getAttribute(c).split(f), U = /([.?@])?(.*)/.exec(_);
          o.push({ type: 1, index: r, name: U[2], strings: g, ctor: U[1] === "." ? Ae : U[1] === "?" ? Ee : U[1] === "@" ? xe : O }), i.removeAttribute(c);
        } else c.startsWith(f) && (o.push({ type: 6, index: r }), i.removeAttribute(c));
        if (re.test(i.tagName)) {
          const c = i.textContent.split(f), _ = c.length - 1;
          if (_ > 0) {
            i.textContent = M ? M.emptyScript : "";
            for (let g = 0; g < _; g++) i.append(c[g], S()), m.nextNode(), o.push({ type: 2, index: ++r });
            i.append(c[_], S());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ne) o.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(f, c + 1)) !== -1; ) o.push({ type: 7, index: r }), c += f.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = y.createElement("template");
    return s.innerHTML = e, s;
  }
}
function A(n, e, t = n, s) {
  if (e === w) return e;
  let i = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const r = k(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = i : t._$Cl = i), i !== void 0 && (e = A(n, i._$AS(n, e.values), i, s)), e;
}
class we {
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
    const { el: { content: t }, parts: s } = this._$AD, i = (e?.creationScope ?? y).importNode(t, !0);
    m.currentNode = i;
    let r = m.nextNode(), a = 0, l = 0, o = s[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new P(r, r.nextSibling, this, e) : o.type === 1 ? d = new o.ctor(r, o.name, o.strings, this, e) : o.type === 6 && (d = new Se(r, this, e)), this._$AV.push(d), o = s[++l];
      }
      a !== o?.index && (r = m.nextNode(), a++);
    }
    return m.currentNode = y, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class P {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    e = A(this, e, t), k(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== w && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ye(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && k(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = C.createElement(ae(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const r = new we(i, this), a = r.u(this.options);
      r.p(t), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = X.get(e.strings);
    return t === void 0 && X.set(e.strings, t = new C(e)), t;
  }
  k(e) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const r of e) i === t.length ? t.push(s = new P(this.O(S()), this.O(S()), this, this.options)) : s = t[i], s._$AI(r), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = q(e).nextSibling;
      q(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class O {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(e, t = this, s, i) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) e = A(this, e, t, 0), a = !k(e) || e !== this._$AH && e !== w, a && (this._$AH = e);
    else {
      const l = e;
      let o, d;
      for (e = r[0], o = 0; o < r.length - 1; o++) d = A(this, l[s + o], t, o), d === w && (d = this._$AH[o]), a ||= !k(d) || d !== this._$AH[o], d === h ? e = h : e !== h && (e += (d ?? "") + r[o + 1]), this._$AH[o] = d;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ae extends O {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Ee extends O {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class xe extends O {
  constructor(e, t, s, i, r) {
    super(e, t, s, i, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = A(this, e, t, 0) ?? h) === w) return;
    const s = this._$AH, i = e === h && s !== h || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== h && (s === h || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Se {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    A(this, e);
  }
}
const ke = z.litHtmlPolyfillSupport;
ke?.(C, P), (z.litHtmlVersions ??= []).push("3.3.3");
const Ce = (n, e, t) => {
  const s = t?.renderBefore ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = t?.renderBefore ?? null;
    s._$litPart$ = i = new P(e.insertBefore(S(), r), r, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
const j = globalThis;
class b extends v {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ce(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
b._$litElement$ = !0, b.finalized = !0, j.litElementHydrateSupport?.({ LitElement: b });
const Pe = j.litElementPolyfillSupport;
Pe?.({ LitElement: b });
(j.litElementVersions ??= []).push("4.2.2");
const Ue = {
  de: {
    title: "PV-Amortisation",
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
}, Ne = {
  de: {
    start_date: "Startdatum",
    investment_cost: "Investitionskosten",
    electricity_price: "Strompreis pro kWh",
    feed_in_tariff: "Einspeisevergütung pro kWh",
    self_consumption_entity: "Entität für Eigenverbrauch",
    export_energy_entity: "Entität für Einspeisung",
    self_consumption_baseline: "Ausgangswert Eigenverbrauch (kWh)",
    export_energy_baseline: "Ausgangswert Einspeisung (kWh)",
    show_breakdown: "Aufschlüsselung anzeigen",
    show_payback_date: "Amortisationsdatum anzeigen",
    show_progress: "Fortschritt anzeigen"
  },
  en: {
    start_date: "Start date",
    investment_cost: "Investment cost",
    electricity_price: "Electricity price per kWh",
    feed_in_tariff: "Feed-in tariff per kWh",
    self_consumption_entity: "Self-consumption energy entity",
    export_energy_entity: "Export energy entity",
    self_consumption_baseline: "Self-consumption baseline (kWh)",
    export_energy_baseline: "Export baseline (kWh)",
    show_breakdown: "Show breakdown",
    show_payback_date: "Show payback date",
    show_progress: "Show progress"
  }
};
function oe(n) {
  return n === "Wh" || n === "kWh" || n === "MWh";
}
function Me(n, e) {
  if (!(!Number.isFinite(n) || !oe(e)))
    return e === "Wh" ? n / 1e3 : e === "MWh" ? n * 1e3 : n;
}
function Te(n, e, t, s = /* @__PURE__ */ new Date()) {
  const i = Math.max(0, e - (n.self_consumption_baseline ?? 0)), r = Math.max(0, t - (n.export_energy_baseline ?? 0)), a = i * n.electricity_price, l = r * n.feed_in_tariff, o = a + l, d = Math.min(100, o / n.investment_cost * 100), p = /* @__PURE__ */ new Date(`${n.start_date}T00:00:00`);
  let c;
  if (o > 0 && p <= s) {
    const _ = Math.max(1, (s.getTime() - p.getTime()) / 864e5);
    c = new Date(
      p.getTime() + n.investment_cost / o * _ * 864e5
    );
  }
  return {
    selfConsumption: i,
    exported: r,
    ownValue: a,
    exportValue: l,
    benefit: o,
    progress: d,
    paybackDate: c
  };
}
function Y(n, e) {
  return `pv-payback-card:last-valid:${JSON.stringify([
    n.self_consumption_entity,
    n.export_energy_entity,
    n.start_date,
    n.self_consumption_baseline ?? 0,
    n.export_energy_baseline ?? 0
  ])}:${e}`;
}
function Oe(n) {
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
function He(n, e) {
  try {
    return Oe(n.getItem(e));
  } catch {
    return;
  }
}
function Re(n, e) {
  return n !== void 0 && n >= 0 ? e && n < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: n, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function De(n) {
  if (!n.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${n.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const e of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(n[e]) || n[e] < 0) return e;
  if (n.investment_cost <= 0) return "investment_cost";
  if (!n.self_consumption_entity || !n.export_energy_entity) return "energy entity";
}
class We extends b {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  hass;
  _config = {};
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
    ].includes(t.name), i = t.type === "checkbox" ? t.checked : s ? Number(t.value) : t.value;
    this._config = { ...this._config, [t.name]: i }, this.dispatchEvent(
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
    const s = String(this._config[e] ?? ""), i = !!(this.hass && customElements.get("ha-entity-picker"));
    return u`<label
      >${t}${i ? u`<ha-entity-picker
              .hass=${this.hass}
              .value=${s}
              .label=${t}
              .includeDomains=${["sensor"]}
              .allowCustomEntity=${!0}
              @value-changed=${(r) => this.entityChanged(e, r)}
            ></ha-entity-picker>` : u`<input name=${e} type="text" .value=${s} @change=${this.changed} />`}</label
    >`;
  }
  render() {
    const e = Ne[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
      ["start_date", e.start_date, "date"],
      ["investment_cost", e.investment_cost, "number"],
      ["electricity_price", e.electricity_price, "number"],
      ["feed_in_tariff", e.feed_in_tariff, "number"]
    ], s = [
      ["self_consumption_baseline", e.self_consumption_baseline, "number"],
      ["export_energy_baseline", e.export_energy_baseline, "number"]
    ], i = ([r, a, l]) => u`<label
        >${a}<input
          name=${r}
          type=${l}
          step="any"
          .value=${String(this._config[r] ?? "")}
          @change=${this.changed}
      /></label>`;
    return u`${t.map(
      i
    )}${this.entityField("self_consumption_entity", e.self_consumption_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${s.map(
      i
    )}${["show_breakdown", "show_payback_date", "show_progress"].map(
      (r) => u`<label
          ><input
            name=${r}
            type="checkbox"
            .checked=${this._config[r] !== !1}
            @change=${this.changed}
          />${e[r]}</label
        >`
    )}`;
  }
  static styles = te`
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
customElements.define("pv-payback-card-editor", We);
class ze extends b {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  hass;
  _config;
  static getStubConfig() {
    return {
      type: "custom:pv-payback-card",
      name: "PV-Amortisation",
      show_breakdown: !0,
      show_payback_date: !0,
      show_progress: !0
    };
  }
  static getConfigElement() {
    return document.createElement("pv-payback-card-editor");
  }
  setConfig(e) {
    this._config = {
      ...e,
      show_breakdown: e.show_breakdown ?? !0,
      show_payback_date: e.show_payback_date ?? !0,
      show_progress: e.show_progress ?? !0
    };
  }
  getCardSize() {
    return 4;
  }
  readEnergy(e, t, s) {
    const i = this.hass?.states[t], r = i ? Number(i.state) : Number.NaN, a = Me(r, i?.attributes?.unit_of_measurement), l = He(localStorage, Y(e, t)), o = Re(a, l);
    if (o.value !== void 0) {
      if (!o.cached) {
        const p = JSON.stringify({
          value: o.value,
          timestamp: i?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(Y(e, t), p);
        } catch {
        }
      }
      return {
        value: o.value,
        cached: o.cached,
        timestamp: o.cached ? l?.timestamp : i?.last_updated,
        warning: o.regression ? `${t}: ${s.counterRegression}` : void 0
      };
    }
    const d = i?.attributes?.unit_of_measurement;
    return {
      cached: !1,
      warning: i && !oe(d) ? `${t}: ${s.unsupportedUnit}` : `${t}: ${s.entityUnavailable}`
    };
  }
  text() {
    return Ue[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
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
      maximumFractionDigits: 1
    }).format(e) + " kWh";
  }
  render() {
    const e = this._config;
    if (!e) return h;
    const t = this.text(), s = De(e);
    if (s)
      return u`<ha-card
        ><div class="content error" role="alert">${t.invalid}: ${s}</div></ha-card
      >`;
    const i = this.readEnergy(e, e.self_consumption_entity, t), r = this.readEnergy(e, e.export_energy_entity, t);
    if (i.value === void 0 || r.value === void 0)
      return u`<ha-card
        ><div class="content error" role="alert">
          ${t.unavailable}${i.warning ? u`<br />${i.warning}` : h}${r.warning ? u`<br />${r.warning}` : h}
        </div></ha-card
      >`;
    const a = Te(e, i.value, r.value), l = i.cached || r.cached, o = [i.timestamp, r.timestamp].filter(Boolean).sort().at(0);
    return u`<ha-card>
      <div class="content">
        <div class="header">
          <ha-icon .icon=${e.icon ?? "mdi:solar-power"}></ha-icon
          ><span>${e.name ?? t.title}</span>
        </div>
        <div class="benefit">
          <span>${t.benefit}</span><strong>${this.formatMoney(a.benefit)}</strong>
        </div>
        ${e.show_progress ? u`<div class="progress-label">
                  <span>${t.progress}</span><span>${a.progress.toFixed(1)}%</span>
                </div>
                <div
                  class="bar"
                  role="progressbar"
                  aria-label=${t.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow=${a.progress}
                >
                  <div style=${`width:${a.progress}%`}></div>
                </div>` : h}
        ${e.show_breakdown ? u`<div class="breakdown">
                <div>
                  <span>${t.own}</span
                  ><b
                    >${this.formatEnergy(a.selfConsumption)} ·
                    ${this.formatMoney(a.ownValue)}</b
                  >
                </div>
                <div>
                  <span>${t.export}</span
                  ><b
                    >${this.formatEnergy(a.exported)} · ${this.formatMoney(a.exportValue)}</b
                  >
                </div>
              </div>` : h}
        ${e.show_payback_date ? u`<div class="date"><span>${t.expected}</span><b>${a.paybackDate ? new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, { dateStyle: "medium" }).format(a.paybackDate) : t.noProjection}</b></div>` : h}
        ${l ? u`<div class="notice" role="status" aria-live="polite">${t.cached}${o ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, { dateStyle: "short", timeStyle: "short" }).format(new Date(o))}` : ""}${i.warning ? u`<br />${i.warning}` : h}${r.warning ? u`<br />${r.warning}` : h}</div>` : h}
      </div>
    </ha-card>`;
  }
  static styles = te`
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
      gap: 10px;
      font-size: 1.1em;
      font-weight: 600;
    }
    ha-icon {
      color: var(--primary-color);
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
    .progress-label,
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
      background: var(--primary-color);
      border-radius: inherit;
      transition: width 0.2s;
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
    .progress-label span:first-child,
    .benefit span {
      color: var(--secondary-text-color);
    }
    .breakdown b {
      font-size: 0.92em;
    }
    .date {
      align-items: start;
      margin-top: 18px;
    }
    .date b {
      text-align: end;
    }
    .notice,
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
customElements.define("pv-payback-card", ze);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  Y as cacheKey,
  Te as calculatePayback,
  Re as chooseEnergyValue,
  Me as energyToKwh,
  Oe as parseCachedEnergy,
  He as readCachedEnergy
};
