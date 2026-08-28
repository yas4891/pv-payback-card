const U = globalThis, R = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, W = /* @__PURE__ */ Symbol(), F = /* @__PURE__ */ new WeakMap();
let ee = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== W) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (R && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = F.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && F.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const le = (i) => new ee(typeof i == "string" ? i : i + "", void 0, W), te = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new ee(t, i, W);
}, he = (i, e) => {
  if (R) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), n = U.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = t.cssText, i.appendChild(s);
  }
}, I = R ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return le(t);
})(i) : i;
const { is: ce, defineProperty: de, getOwnPropertyDescriptor: pe, getOwnPropertyNames: ue, getOwnPropertySymbols: _e, getPrototypeOf: ge } = Object, T = globalThis, L = T.trustedTypes, fe = L ? L.emptyScript : "", me = T.reactiveElementPolyfillSupport, x = (i, e) => i, H = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? fe : null;
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
} }, se = (i, e) => !ce(i, e), B = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: se };
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
      const s = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(e, s, t);
      n !== void 0 && de(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: n, set: r } = pe(this.prototype, e) ?? { get() {
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
      for (const n of s) t.unshift(I(n));
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
    return he(e, this.constructor.elementStyles), e;
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
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : H).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, n = s._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const r = s.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : H;
      this._$Em = n;
      const l = o.fromAttribute(t, r.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, n = !1, r) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[e]), s ??= o.getPropertyOptions(e), !((s.hasChanged ?? se)(r, t) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, s)))) return;
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[x("elementProperties")] = /* @__PURE__ */ new Map(), v[x("finalized")] = /* @__PURE__ */ new Map(), me?.({ ReactiveElement: v }), (T.reactiveElementVersions ??= []).push("2.1.2");
const z = globalThis, q = (i) => i, M = z.trustedTypes, J = M ? M.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ie = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, ne = "?" + f, $e = `<${ne}>`, y = document, S = () => y.createComment(""), k = (i) => i === null || typeof i != "object" && typeof i != "function", V = Array.isArray, ye = (i) => V(i) || typeof i?.[Symbol.iterator] == "function", D = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, K = /-->/g, Z = />/g, m = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), G = /'/g, Q = /"/g, re = /^(?:script|style|textarea|title)$/i, ve = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), u = ve(1), w = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), X = /* @__PURE__ */ new WeakMap(), $ = y.createTreeWalker(y, 129);
function oe(i, e) {
  if (!V(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return J !== void 0 ? J.createHTML(e) : e;
}
const be = (i, e) => {
  const t = i.length - 1, s = [];
  let n, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = E;
  for (let l = 0; l < t; l++) {
    const a = i[l];
    let d, p, h = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, p = o.exec(a), p !== null); ) _ = o.lastIndex, o === E ? p[1] === "!--" ? o = K : p[1] !== void 0 ? o = Z : p[2] !== void 0 ? (re.test(p[2]) && (n = RegExp("</" + p[2], "g")), o = m) : p[3] !== void 0 && (o = m) : o === m ? p[0] === ">" ? (o = n ?? E, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? m : p[3] === '"' ? Q : G) : o === Q || o === G ? o = m : o === K || o === Z ? o = E : (o = m, n = void 0);
    const g = o === m && i[l + 1].startsWith("/>") ? " " : "";
    r += o === E ? a + $e : h >= 0 ? (s.push(d), a.slice(0, h) + ie + a.slice(h) + f + g) : a + f + (h === -2 ? l : g);
  }
  return [oe(i, r + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class C {
  constructor({ strings: e, _$litType$: t }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const l = e.length - 1, a = this.parts, [d, p] = be(e, t);
    if (this.el = C.createElement(d, s), $.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = $.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(ie)) {
          const _ = p[o++], g = n.getAttribute(h).split(f), N = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: r, name: N[2], strings: g, ctor: N[1] === "." ? Ae : N[1] === "?" ? Ee : N[1] === "@" ? xe : O }), n.removeAttribute(h);
        } else h.startsWith(f) && (a.push({ type: 6, index: r }), n.removeAttribute(h));
        if (re.test(n.tagName)) {
          const h = n.textContent.split(f), _ = h.length - 1;
          if (_ > 0) {
            n.textContent = M ? M.emptyScript : "";
            for (let g = 0; g < _; g++) n.append(h[g], S()), $.nextNode(), a.push({ type: 2, index: ++r });
            n.append(h[_], S());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ne) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(f, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += f.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = y.createElement("template");
    return s.innerHTML = e, s;
  }
}
function A(i, e, t = i, s) {
  if (e === w) return e;
  let n = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const r = k(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = n : t._$Cl = n), n !== void 0 && (e = A(i, n._$AS(i, e.values), n, s)), e;
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
    const { el: { content: t }, parts: s } = this._$AD, n = (e?.creationScope ?? y).importNode(t, !0);
    $.currentNode = n;
    let r = $.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new P(r, r.nextSibling, this, e) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, e) : a.type === 6 && (d = new Se(r, this, e)), this._$AV.push(d), a = s[++l];
      }
      o !== a?.index && (r = $.nextNode(), o++);
    }
    return $.currentNode = y, n;
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
    e = A(this, e, t), k(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== w && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ye(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && k(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, n = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = C.createElement(oe(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(t);
    else {
      const r = new we(n, this), o = r.u(this.options);
      r.p(t), this.T(o), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = X.get(e.strings);
    return t === void 0 && X.set(e.strings, t = new C(e)), t;
  }
  k(e) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, n = 0;
    for (const r of e) n === t.length ? t.push(s = new P(this.O(S()), this.O(S()), this, this.options)) : s = t[n], s._$AI(r), n++;
    n < t.length && (this._$AR(s && s._$AB.nextSibling, n), t.length = n);
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
  constructor(e, t, s, n, r) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(e, t = this, s, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) e = A(this, e, t, 0), o = !k(e) || e !== this._$AH && e !== w, o && (this._$AH = e);
    else {
      const l = e;
      let a, d;
      for (e = r[0], a = 0; a < r.length - 1; a++) d = A(this, l[s + a], t, a), d === w && (d = this._$AH[a]), o ||= !k(d) || d !== this._$AH[a], d === c ? e = c : e !== c && (e += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ae extends O {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class Ee extends O {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class xe extends O {
  constructor(e, t, s, n, r) {
    super(e, t, s, n, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = A(this, e, t, 0) ?? c) === w) return;
    const s = this._$AH, n = e === c && s !== c || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== c && (s === c || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
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
const Ce = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = t?.renderBefore ?? null;
    s._$litPart$ = n = new P(e.insertBefore(S(), r), r, void 0, t ?? {});
  }
  return n._$AI(i), n;
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
const Ne = {
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
}, Ue = {
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
    show_energy_values: "Energiewerte anzeigen",
    show_money_values: "Geldwerte anzeigen",
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
    show_energy_values: "Show energy values",
    show_money_values: "Show monetary values",
    show_payback_date: "Show payback date",
    show_progress: "Show progress"
  }
};
function ae(i) {
  return i === "Wh" || i === "kWh" || i === "MWh";
}
function Me(i, e) {
  if (!(!Number.isFinite(i) || !ae(e)))
    return e === "Wh" ? i / 1e3 : e === "MWh" ? i * 1e3 : i;
}
function Te(i) {
  return {
    ...i,
    show_breakdown: i.show_breakdown ?? !0,
    show_energy_values: i.show_energy_values ?? !0,
    show_money_values: i.show_money_values ?? !0,
    show_payback_date: i.show_payback_date ?? !0,
    show_progress: i.show_progress ?? !0
  };
}
function Oe(i, e) {
  return !i || i === "PV-Amortisation" ? e : i;
}
function De(i, e, t, s = /* @__PURE__ */ new Date()) {
  const n = Math.max(0, e - (i.self_consumption_baseline ?? 0)), r = Math.max(0, t - (i.export_energy_baseline ?? 0)), o = n * i.electricity_price, l = r * i.feed_in_tariff, a = o + l, d = Math.min(100, a / i.investment_cost * 100), p = /* @__PURE__ */ new Date(`${i.start_date}T00:00:00`);
  let h;
  if (a > 0 && p <= s) {
    const _ = Math.max(1, (s.getTime() - p.getTime()) / 864e5);
    h = new Date(
      p.getTime() + i.investment_cost / a * _ * 864e5
    );
  }
  return {
    selfConsumption: n,
    exported: r,
    ownValue: o,
    exportValue: l,
    benefit: a,
    progress: d,
    paybackDate: h
  };
}
function Y(i, e) {
  return `pv-payback-card:last-valid:${JSON.stringify([
    i.self_consumption_entity,
    i.export_energy_entity,
    i.start_date,
    i.self_consumption_baseline ?? 0,
    i.export_energy_baseline ?? 0
  ])}:${e}`;
}
function He(i) {
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
function Re(i, e) {
  try {
    return He(i.getItem(e));
  } catch {
    return;
  }
}
function We(i, e) {
  return i !== void 0 && i >= 0 ? e && i < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: i, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function ze(i) {
  if (!i.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${i.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const e of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(i[e]) || i[e] < 0) return e;
  if (i.investment_cost <= 0) return "investment_cost";
  if (!i.self_consumption_entity || !i.export_energy_entity) return "energy entity";
}
class Ve extends b {
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
    return this.hass && customElements.get("ha-entity-picker") ? u`<ha-entity-picker
        .hass=${this.hass}
        .value=${s}
        .label=${t}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${!0}
        @value-changed=${(r) => this.entityChanged(e, r)}
      ></ha-entity-picker>` : u`<label
      >${t}<input name=${e} type="text" .value=${s} @change=${this.changed}
    /></label>`;
  }
  render() {
    const e = Ue[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
      ["start_date", e.start_date, "date"],
      ["investment_cost", e.investment_cost, "number"],
      ["electricity_price", e.electricity_price, "number"],
      ["feed_in_tariff", e.feed_in_tariff, "number"]
    ], s = [
      ["self_consumption_baseline", e.self_consumption_baseline, "number"],
      ["export_energy_baseline", e.export_energy_baseline, "number"]
    ], n = ([r, o, l]) => u`<label
        >${o}<input
          name=${r}
          type=${l}
          step="any"
          .value=${String(this._config[r] ?? "")}
          @change=${this.changed}
      /></label>`;
    return u`${t.map(
      n
    )}${this.entityField("self_consumption_entity", e.self_consumption_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${s.map(
      n
    )}${[
      "show_breakdown",
      "show_energy_values",
      "show_money_values",
      "show_payback_date",
      "show_progress"
    ].map(
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
customElements.define("pv-payback-card-editor", Ve);
class je extends b {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  static getStubConfig() {
    return {
      type: "custom:pv-payback-card",
      show_breakdown: !0,
      show_energy_values: !0,
      show_money_values: !0,
      show_payback_date: !0,
      show_progress: !0
    };
  }
  static getConfigElement() {
    return document.createElement("pv-payback-card-editor");
  }
  setConfig(e) {
    this._config = Te(e);
  }
  getCardSize() {
    return 4;
  }
  readEnergy(e, t, s) {
    const n = this.hass?.states[t], r = n ? Number(n.state) : Number.NaN, o = Me(r, n?.attributes?.unit_of_measurement), l = Re(localStorage, Y(e, t)), a = We(o, l);
    if (a.value !== void 0) {
      if (!a.cached) {
        const p = JSON.stringify({
          value: a.value,
          timestamp: n?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(Y(e, t), p);
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
    const d = n?.attributes?.unit_of_measurement;
    return {
      cached: !1,
      warning: n && !ae(d) ? `${t}: ${s.unsupportedUnit}` : `${t}: ${s.entityUnavailable}`
    };
  }
  text() {
    return Ne[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
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
  render() {
    const e = this._config;
    if (!e) return c;
    const t = this.text(), s = ze(e);
    if (s)
      return u`<ha-card
        ><div class="content error" role="alert">${t.invalid}: ${s}</div></ha-card
      >`;
    const n = this.readEnergy(e, e.self_consumption_entity, t), r = this.readEnergy(e, e.export_energy_entity, t);
    if (n.value === void 0 || r.value === void 0)
      return u`<ha-card
        ><div class="content error" role="alert">
          ${t.unavailable}${n.warning ? u`<br />${n.warning}` : c}${r.warning ? u`<br />${r.warning}` : c}
        </div></ha-card
      >`;
    const o = De(e, n.value, r.value), l = n.cached || r.cached, a = [n.timestamp, r.timestamp].filter(Boolean).sort().at(0);
    return u`<ha-card>
      <div class="content">
        <div class="header">
          <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
          ><span>${Oe(e.name, t.title)}</span>
        </div>
        <div class="benefit">
          <span>${t.benefit}</span><strong>${this.formatMoney(o.benefit)}</strong>
        </div>
        ${e.show_progress ? u`<div class="progress-label">
                  <span>${t.progress}</span><span>${o.progress.toFixed(1)}%</span>
                </div>
                <div
                  class="bar"
                  role="progressbar"
                  aria-label=${t.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow=${o.progress}
                >
                  <div style=${`width:${o.progress}%`}></div>
                </div>` : c}
        ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? u`<div class="breakdown">
                <div>
                  <span>${t.own}</span
                  ><b
                    >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(o.selfConsumption)} · ${this.formatMoney(o.ownValue)}` : e.show_energy_values ? this.formatEnergy(o.selfConsumption) : this.formatMoney(o.ownValue)}</b
                  >
                </div>
                <div>
                  <span>${t.export}</span
                  ><b
                    >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(o.exported)} · ${this.formatMoney(o.exportValue)}` : e.show_energy_values ? this.formatEnergy(o.exported) : this.formatMoney(o.exportValue)}</b
                  >
                </div>
              </div>` : c}
        ${e.show_payback_date ? u`<div class="date"><span>${t.expected}</span><b>${o.paybackDate ? new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, { dateStyle: "medium" }).format(o.paybackDate) : t.noProjection}</b></div>` : c}
        ${l ? u`<div class="notice" role="status" aria-live="polite">${t.cached}${a ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, { dateStyle: "short", timeStyle: "short" }).format(new Date(a))}` : ""}${n.warning ? u`<br />${n.warning}` : c}${r.warning ? u`<br />${r.warning}` : c}</div>` : c}
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
      background: linear-gradient(
        90deg,
        var(--info-color, #03a9f4) 0%,
        var(--success-color, #4caf50) 100%
      );
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
customElements.define("pv-payback-card", je);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  je as PVPaybackCard,
  Ve as PVPaybackCardEditor,
  Y as cacheKey,
  De as calculatePayback,
  We as chooseEnergyValue,
  Oe as displayName,
  Me as energyToKwh,
  He as parseCachedEnergy,
  Re as readCachedEnergy,
  Te as withDisplayDefaults
};
