const I = globalThis, Q = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ee = /* @__PURE__ */ Symbol(), oe = /* @__PURE__ */ new WeakMap();
let $e = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== ee) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Q && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = oe.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && oe.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ne = (s) => new $e(typeof s == "string" ? s : s + "", void 0, ee), we = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, n, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[o + 1], s[0]);
  return new $e(t, s, ee);
}, Pe = (s, e) => {
  if (Q) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), n = I.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = t.cssText, s.appendChild(i);
  }
}, re = Q ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return Ne(t);
})(s) : s;
const { is: Te, defineProperty: Oe, getOwnPropertyDescriptor: Re, getOwnPropertyNames: Ue, getOwnPropertySymbols: We, getPrototypeOf: ze } = Object, L = globalThis, ce = L.trustedTypes, Fe = ce ? ce.emptyScript : "", Ve = L.reactiveElementPolyfillSupport, z = (s, e) => s, X = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Fe : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, xe = (s, e) => !Te(s, e), le = { attribute: !0, type: String, converter: X, reflect: !1, useDefault: !1, hasChanged: xe };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = le) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(e, i, t);
      n !== void 0 && Oe(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: n, set: o } = Re(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: n, set(a) {
      const r = n?.call(this);
      o?.call(this, a), this.requestUpdate(e, r, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? le;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = ze(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, i = [...Ue(t), ...We(t)];
      for (const n of i) this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, n] of t) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const n = this._$Eu(t, i);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const n of i) t.unshift(re(n));
    } else e !== void 0 && t.push(re(e));
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
    return Pe(e, this.constructor.elementStyles), e;
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
    const i = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, i);
    if (n !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : X).toAttribute(t, i.type);
      this._$Em = e, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const o = i.getPropertyOptions(n), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : X;
      this._$Em = n;
      const r = a.fromAttribute(t, o.type);
      this[n] = r ?? this._$Ej?.get(n) ?? r, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, n = !1, o) {
    if (e !== void 0) {
      const a = this.constructor;
      if (n === !1 && (o = this[e]), i ??= a.getPropertyOptions(e), !((i.hasChanged ?? xe)(o, t) || i.useDefault && i.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: n, wrapped: o }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), o !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: a } = o, r = this[n];
        a !== !0 || this._$AL.has(n) || r === void 0 || this.C(n, void 0, o, r);
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
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[z("elementProperties")] = /* @__PURE__ */ new Map(), N[z("finalized")] = /* @__PURE__ */ new Map(), Ve?.({ ReactiveElement: N }), (L.reactiveElementVersions ??= []).push("2.1.2");
const te = globalThis, ue = (s) => s, B = te.trustedTypes, de = B ? B.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Ae = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Se = "?" + k, He = `<${Se}>`, M = document, F = () => M.createComment(""), V = (s) => s === null || typeof s != "object" && typeof s != "function", se = Array.isArray, Ke = (s) => se(s) || typeof s?.[Symbol.iterator] == "function", Y = `[ 	
\f\r]`, W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, pe = />/g, D = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, me = /"/g, ke = /^(?:script|style|textarea|title)$/i, Ie = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), y = Ie(1), O = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), ge = /* @__PURE__ */ new WeakMap(), C = M.createTreeWalker(M, 129);
function Ee(s, e) {
  if (!se(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return de !== void 0 ? de.createHTML(e) : e;
}
const je = (s, e) => {
  const t = s.length - 1, i = [];
  let n, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = W;
  for (let r = 0; r < t; r++) {
    const c = s[r];
    let u, p, l = -1, h = 0;
    for (; h < c.length && (a.lastIndex = h, p = a.exec(c), p !== null); ) h = a.lastIndex, a === W ? p[1] === "!--" ? a = he : p[1] !== void 0 ? a = pe : p[2] !== void 0 ? (ke.test(p[2]) && (n = RegExp("</" + p[2], "g")), a = D) : p[3] !== void 0 && (a = D) : a === D ? p[0] === ">" ? (a = n ?? W, l = -1) : p[1] === void 0 ? l = -2 : (l = a.lastIndex - p[2].length, u = p[1], a = p[3] === void 0 ? D : p[3] === '"' ? me : _e) : a === me || a === _e ? a = D : a === he || a === pe ? a = W : (a = D, n = void 0);
    const _ = a === D && s[r + 1].startsWith("/>") ? " " : "";
    o += a === W ? c + He : l >= 0 ? (i.push(u), c.slice(0, l) + Ae + c.slice(l) + k + _) : c + k + (l === -2 ? r : _);
  }
  return [Ee(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: e, _$litType$: t }, i) {
    let n;
    this.parts = [];
    let o = 0, a = 0;
    const r = e.length - 1, c = this.parts, [u, p] = je(e, t);
    if (this.el = H.createElement(u, i), C.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (n = C.nextNode()) !== null && c.length < r; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const l of n.getAttributeNames()) if (l.endsWith(Ae)) {
          const h = p[a++], _ = n.getAttribute(l).split(k), m = /([.?@])?(.*)/.exec(h);
          c.push({ type: 1, index: o, name: m[2], strings: _, ctor: m[1] === "." ? Le : m[1] === "?" ? qe : m[1] === "@" ? Je : q }), n.removeAttribute(l);
        } else l.startsWith(k) && (c.push({ type: 6, index: o }), n.removeAttribute(l));
        if (ke.test(n.tagName)) {
          const l = n.textContent.split(k), h = l.length - 1;
          if (h > 0) {
            n.textContent = B ? B.emptyScript : "";
            for (let _ = 0; _ < h; _++) n.append(l[_], F()), C.nextNode(), c.push({ type: 2, index: ++o });
            n.append(l[h], F());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Se) c.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = n.data.indexOf(k, l + 1)) !== -1; ) c.push({ type: 7, index: o }), l += k.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const i = M.createElement("template");
    return i.innerHTML = e, i;
  }
}
function R(s, e, t = s, i) {
  if (e === O) return e;
  let n = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const o = V(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(s), n._$AT(s, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = n : t._$Cl = n), n !== void 0 && (e = R(s, n._$AS(s, e.values), n, i)), e;
}
class Be {
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
    const { el: { content: t }, parts: i } = this._$AD, n = (e?.creationScope ?? M).importNode(t, !0);
    C.currentNode = n;
    let o = C.nextNode(), a = 0, r = 0, c = i[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let u;
        c.type === 2 ? u = new K(o, o.nextSibling, this, e) : c.type === 1 ? u = new c.ctor(o, c.name, c.strings, this, e) : c.type === 6 && (u = new Ye(o, this, e)), this._$AV.push(u), c = i[++r];
      }
      a !== c?.index && (o = C.nextNode(), a++);
    }
    return C.currentNode = M, n;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class K {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, n) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    e = R(this, e, t), V(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ke(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && V(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = H.createElement(Ee(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(t);
    else {
      const o = new Be(n, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ge.get(e.strings);
    return t === void 0 && ge.set(e.strings, t = new H(e)), t;
  }
  k(e) {
    se(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, n = 0;
    for (const o of e) n === t.length ? t.push(i = new K(this.O(F()), this.O(F()), this, this.options)) : i = t[n], i._$AI(o), n++;
    n < t.length && (this._$AR(i && i._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = ue(e).nextSibling;
      ue(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, n, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(e, t = this, i, n) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) e = R(this, e, t, 0), a = !V(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
    else {
      const r = e;
      let c, u;
      for (e = o[0], c = 0; c < o.length - 1; c++) u = R(this, r[i + c], t, c), u === O && (u = this._$AH[c]), a ||= !V(u) || u !== this._$AH[c], u === d ? e = d : e !== d && (e += (u ?? "") + o[c + 1]), this._$AH[c] = u;
    }
    a && !n && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Le extends q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class qe extends q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Je extends q {
  constructor(e, t, i, n, o) {
    super(e, t, i, n, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = R(this, e, t, 0) ?? d) === O) return;
    const i = this._$AH, n = e === d && i !== d || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== d && (i === d || n);
    n && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ye {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    R(this, e);
  }
}
const Ze = te.litHtmlPolyfillSupport;
Ze?.(H, K), (te.litHtmlVersions ??= []).push("3.3.3");
const Ge = (s, e, t) => {
  const i = t?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const o = t?.renderBefore ?? null;
    i._$litPart$ = n = new K(e.insertBefore(F(), o), o, void 0, t ?? {});
  }
  return n._$AI(s), n;
};
const ie = globalThis;
class P extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ge(t, this.renderRoot, this.renderOptions);
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
P._$litElement$ = !0, P.finalized = !0, ie.litElementHydrateSupport?.({ LitElement: P });
const Xe = ie.litElementPolyfillSupport;
Xe?.({ LitElement: P });
(ie.litElementVersions ??= []).push("4.2.2");
const Qe = 365.2425, et = 366 * 50, ye = 180 * 1e3, fe = /* @__PURE__ */ new Map(), tt = {
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
}, st = {
  de: {
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
function De(s) {
  return s === "Wh" || s === "kWh" || s === "MWh";
}
function it(s, e) {
  if (!(!Number.isFinite(s) || !De(e)))
    return e === "Wh" ? s / 1e3 : e === "MWh" ? s * 1e3 : s;
}
function nt(s) {
  return {
    ...s,
    display_style: s.display_style ?? "full",
    show_breakdown: s.show_breakdown ?? !0,
    show_energy_values: s.show_energy_values ?? !0,
    show_money_values: s.show_money_values ?? !0,
    show_payback_date: s.show_payback_date ?? !0,
    show_progress: s.show_progress ?? !0,
    show_contribution_segments: s.show_contribution_segments ?? !1,
    use_location_seasonality: s.use_location_seasonality ?? !1,
    annual_discount_rate: s.annual_discount_rate ?? 0,
    apply_annual_discount: s.apply_annual_discount ?? s.use_historical_statistics ?? !1
  };
}
function ne(s) {
  return s.apply_annual_discount ?? s.use_historical_statistics ?? !1;
}
function at(s, e) {
  return !s || s === "PV-Amortisation" ? e : s;
}
function ot(s, e, t, i) {
  if (t <= 0 || s > e) return;
  const n = Math.max(1, (e.getTime() - s.getTime()) / 864e5);
  return new Date(s.getTime() + i / t * n * 864e5);
}
function x(s) {
  return new Date(s.getFullYear(), s.getMonth(), s.getDate());
}
function T(s, e) {
  const t = new Date(s.getFullYear(), 0, 0), i = Math.round((x(s).getTime() - t.getTime()) / 864e5), n = e * Math.PI / 180, o = 0.409 * Math.sin(2 * Math.PI * i / 365 - 1.39), a = -Math.tan(n) * Math.tan(o), r = Math.acos(Math.max(-1, Math.min(1, a))), c = r * Math.sin(n) * Math.sin(o) + Math.cos(n) * Math.cos(o) * Math.sin(r);
  return Math.max(0, c);
}
function rt(s, e, t, i, n) {
  const o = /* @__PURE__ */ new Date(`${s}T00:00:00`);
  if (Number.isNaN(o.getTime()) || !Number.isFinite(e.getTime()) || !Number.isFinite(t) || t <= 0 || !Number.isFinite(i) || i <= 0 || !Number.isFinite(n) || n < -90 || n > 90 || o > e)
    return;
  const a = x(e);
  let r = 0;
  for (let _ = x(o); _ <= a; _.setDate(_.getDate() + 1))
    r += T(_, n);
  if (!Number.isFinite(r) || r <= 0) return;
  const c = t / r, u = Math.max(1e-9, i * Number.EPSILON * 16);
  if (t >= i) {
    let _ = 0;
    for (let m = x(o); m <= a; m.setDate(m.getDate() + 1))
      if (_ += T(m, n) * c, _ >= i - u) return new Date(m);
    return;
  }
  let p = t;
  const l = new Date(a), h = 366 * 50;
  for (let _ = 0; _ < h; _ += 1) {
    if (p >= i - u) return new Date(l);
    l.setDate(l.getDate() + 1), p += T(l, n) * c;
  }
}
function J(s, e) {
  return typeof s == "number" && Number.isFinite(s) && s >= -90 && s <= 90 && typeof e == "number" && Number.isFinite(e) && e >= -180 && e <= 180;
}
function E(s) {
  return [
    s.getFullYear(),
    String(s.getMonth() + 1).padStart(2, "0"),
    String(s.getDate()).padStart(2, "0")
  ].join("-");
}
function Z(s, e, t) {
  const i = Math.max(
    0,
    (x(s).getTime() - x(e).getTime()) / 864e5
  );
  return 1 / (1 + t / 100) ** (i / Qe);
}
function ct(s) {
  const e = s.start ?? s.start_time;
  if (typeof e == "number")
    return !Number.isFinite(e) || Number.isNaN(new Date(e).getTime()) ? void 0 : E(new Date(e));
  if (!(typeof e != "string" || Number.isNaN(new Date(e).getTime())))
    return e.slice(0, 10);
}
function G(s) {
  const e = /* @__PURE__ */ new Map();
  let t;
  for (const i of s ?? []) {
    const n = ct(i), o = typeof i.sum == "number" ? i.sum : Number.NaN;
    if (!n || !Number.isFinite(o)) {
      t = void 0;
      continue;
    }
    if (t !== void 0) {
      const a = o - t;
      a >= 0 && e.set(n, a);
    }
    t = o;
  }
  return e;
}
function be(s, e) {
  const t = G(e?.[s.export_energy_entity]), i = s.self_consumption_entity ? G(e?.[s.self_consumption_entity]) : void 0, n = s.production_energy_entity ? G(e?.[s.production_energy_entity]) : void 0;
  return [.../* @__PURE__ */ new Set([
    ...t.keys(),
    ...i?.keys() ?? [],
    ...n?.keys() ?? []
  ])].sort().flatMap((a) => {
    const r = t.get(a);
    if (r === void 0) return [];
    const c = i ? i.get(a) : n?.get(a) === void 0 ? void 0 : Math.max(0, n.get(a) - r);
    return c === void 0 || !Number.isFinite(c) || c < 0 ? [] : [{ date: a, selfConsumption: c, exported: r }];
  });
}
function Ce(s, e) {
  const t = s.self_consumption_entity ? ["direct", s.self_consumption_entity, s.export_energy_entity] : ["derived", s.production_energy_entity, s.export_energy_entity];
  return JSON.stringify([t, s.start_date, e]);
}
function lt(s, e, t = /* @__PURE__ */ new Date()) {
  if (!s.callWS || !ne(e) || (e.annual_discount_rate ?? 0) <= 0)
    return;
  const i = /* @__PURE__ */ new Date(`${e.start_date}T00:00:00`);
  if (Number.isNaN(i.getTime()) || Number.isNaN(t.getTime())) return;
  const n = x(i);
  n.setDate(n.getDate() - 1);
  const o = x(t), a = x(t);
  a.setDate(a.getDate() - 1);
  const r = E(a), c = Ce(e, r), u = fe.get(c);
  if (u) return u;
  const p = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity], l = s.callWS({
    type: "recorder/statistics_during_period",
    start_time: `${E(n)}T00:00:00`,
    end_time: `${E(o)}T00:00:00`,
    statistic_ids: p,
    period: "day",
    types: ["sum"]
  }).then(
    (h) => h && typeof h == "object" ? h : void 0
  ).catch(() => {
  });
  return fe.set(c, l), l;
}
function ut(s, e, t, i) {
  const n = s.use_location_seasonality && J(i?.latitude, i?.longitude), o = [];
  for (let r = x(e); r <= x(t); r.setDate(r.getDate() + 1))
    o.push({
      date: new Date(r),
      weight: n ? T(r, i.latitude) : 1
    });
  return o.reduce((r, c) => r + c.weight, 0) > 0 ? o : o.map((r) => ({ ...r, weight: 1 }));
}
function dt(s, e, t, i, n, o) {
  const a = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`);
  if (Number.isNaN(a.getTime()) || a > i) return [];
  const r = ut(s, a, i, n), c = new Map((o ?? []).map((h) => [h.date, h])), u = (h, _) => {
    const m = r.map(
      ({ date: w }) => Math.max(0, c.get(E(w))?.[_] ?? 0)
    ), b = m.reduce((w, v) => w + v, 0), f = r.reduce(
      (w, v, S) => w + (m[S] > 0 ? 0 : v.weight),
      0
    ), g = r.map((w, v) => b > 0 && m[v] > 0 ? m[v] : f > 0 ? h * w.weight / f : 0), A = g.reduce((w, v) => w + v, 0);
    return A > 0 ? g.map((w) => w * h / A) : g;
  }, p = u(Math.max(0, e), "selfConsumption"), l = u(Math.max(0, t), "exported");
  return r.map((h, _) => ({
    date: E(h.date),
    selfConsumption: p[_],
    exported: l[_]
  }));
}
function ht(s, e, t, i) {
  const n = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`), o = s.annual_discount_rate ?? 0;
  let a = 0, r = 0, c = 0, u;
  for (const b of t) {
    const f = /* @__PURE__ */ new Date(`${b.date}T00:00:00`), g = b.selfConsumption * s.electricity_price * Z(f, n, o), A = b.exported * s.feed_in_tariff * Z(f, n, o);
    a += g, r += A, c += g + A, !u && c >= s.investment_cost && (u = f);
  }
  if (u) return { ownValue: a, exportValue: r, paybackDate: u };
  const p = s.use_location_seasonality && J(i?.latitude, i?.longitude), l = t.reduce(
    (b, f) => b + (p ? T(/* @__PURE__ */ new Date(`${f.date}T00:00:00`), i.latitude) : 1),
    0
  ), h = t.reduce(
    (b, f) => b + f.selfConsumption * s.electricity_price + f.exported * s.feed_in_tariff,
    0
  );
  if (l <= 0 || h <= 0) return { ownValue: a, exportValue: r };
  const _ = h / l, m = x(e);
  for (let b = 0; b < et; b += 1) {
    m.setDate(m.getDate() + 1);
    const f = p ? T(m, i.latitude) : 1;
    if (c += _ * f * Z(m, n, o), c >= s.investment_cost)
      return { ownValue: a, exportValue: r, paybackDate: new Date(m) };
  }
  return { ownValue: a, exportValue: r };
}
function j(s, e, t, i = /* @__PURE__ */ new Date(), n, o) {
  const a = Math.max(0, t - (s.export_energy_baseline ?? 0)), r = s.self_consumption_entity ? Math.max(0, e - (s.self_consumption_baseline ?? 0)) : Math.max(
    0,
    e - (s.production_energy_baseline ?? 0) - a
  ), c = r * s.electricity_price, u = a * s.feed_in_tariff;
  if (ne(s) && (s.annual_discount_rate ?? 0) > 0) {
    const w = dt(
      s,
      r,
      a,
      i,
      n,
      o
    ), v = ht(s, i, w, n), S = v.ownValue + v.exportValue;
    return {
      selfConsumption: r,
      exported: a,
      ownValue: v.ownValue,
      exportValue: v.exportValue,
      benefit: S,
      progress: Math.min(100, S / s.investment_cost * 100),
      paybackDate: v.paybackDate
    };
  }
  const p = c, l = u, h = p + l, _ = Math.min(100, h / s.investment_cost * 100), m = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`), b = ot(m, i, h, s.investment_cost), f = n?.latitude, g = n?.longitude, A = s.use_location_seasonality && J(f, g) ? rt(
    s.start_date,
    i,
    h,
    s.investment_cost,
    f
  ) ?? b : b;
  return {
    selfConsumption: r,
    exported: a,
    ownValue: p,
    exportValue: l,
    benefit: h,
    progress: _,
    paybackDate: A
  };
}
function pt(s, e, t, i = /* @__PURE__ */ new Date(), n, o, a = s.annual_discount_rate ?? 3) {
  const r = {
    ...s,
    apply_annual_discount: !1,
    use_historical_statistics: !1
  };
  return {
    linear: j(
      { ...r, use_location_seasonality: !1, annual_discount_rate: 0 },
      e,
      t,
      i,
      n,
      o
    ),
    seasonal: j(
      { ...r, use_location_seasonality: !0, annual_discount_rate: 0 },
      e,
      t,
      i,
      n,
      o
    ),
    discounted: j(
      {
        ...r,
        use_location_seasonality: !0,
        annual_discount_rate: a,
        apply_annual_discount: !0
      },
      e,
      t,
      i,
      n,
      o
    )
  };
}
function ve(s, e) {
  const t = !!s.self_consumption_entity;
  return `pv-payback-card:last-valid:${JSON.stringify([
    t ? "direct-self-consumption" : "derived-self-consumption",
    t ? s.self_consumption_entity : s.production_energy_entity,
    s.export_energy_entity,
    s.start_date,
    s.self_consumption_baseline ?? 0,
    s.production_energy_baseline ?? 0,
    s.export_energy_baseline ?? 0
  ])}:${e}`;
}
function _t(s) {
  if (s)
    try {
      const e = JSON.parse(s);
      return typeof e.value != "number" || !Number.isFinite(e.value) || e.value < 0 ? void 0 : {
        value: e.value,
        timestamp: typeof e.timestamp == "string" ? e.timestamp : void 0
      };
    } catch {
      return;
    }
}
function mt(s, e) {
  try {
    return _t(s.getItem(e));
  } catch {
    return;
  }
}
function gt(s, e) {
  return s !== void 0 && s >= 0 ? e && s < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: s, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function yt(s) {
  if (s.display_style !== void 0 && !["full", "compact"].includes(s.display_style))
    return "display_style";
  if (!s.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${s.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const e of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(s[e]) || s[e] < 0) return e;
  if (s.investment_cost <= 0) return "investment_cost";
  for (const e of [
    "self_consumption_baseline",
    "production_energy_baseline",
    "export_energy_baseline"
  ]) {
    const t = s[e];
    if (t !== void 0 && !Number.isFinite(t)) return e;
  }
  if (!Number.isFinite(s.annual_discount_rate ?? 0) || (s.annual_discount_rate ?? 0) < 0)
    return "annual_discount_rate";
  if (!s.export_energy_entity || !s.self_consumption_entity && !s.production_energy_entity)
    return "energy entity";
}
class ft extends P {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  constructor() {
    super(), this._config = {};
  }
  setConfig(e) {
    this._config = { ...e };
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
    ].includes(t.name), n = t.type === "checkbox" ? t.checked : i ? Number(t.value) : t.value;
    this._config = { ...this._config, [t.name]: n }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityChanged(e, t) {
    const i = t.detail?.value;
    typeof i == "string" && (this._config = { ...this._config, [e]: i }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    ));
  }
  entityField(e, t) {
    const i = String(this._config[e] ?? "");
    return this.hass && customElements.get("ha-entity-picker") ? y`<ha-entity-picker
        .hass=${this.hass}
        .value=${i}
        .label=${t}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${!0}
        @value-changed=${(o) => this.entityChanged(e, o)}
      ></ha-entity-picker>` : y`<label
      >${t}<input name=${e} type="text" .value=${i} @change=${this.changed}
    /></label>`;
  }
  render() {
    const e = st[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
      ["start_date", e.start_date, "date"],
      ["investment_cost", e.investment_cost, "number"],
      ["electricity_price", e.electricity_price, "number"],
      ["feed_in_tariff", e.feed_in_tariff, "number"]
    ], n = [
      !!this._config.self_consumption_entity ? ["self_consumption_baseline", e.self_consumption_baseline, "number"] : ["production_energy_baseline", e.production_energy_baseline, "number"],
      ["export_energy_baseline", e.export_energy_baseline, "number"],
      ["annual_discount_rate", e.annual_discount_rate, "number"]
    ], o = ([a, r, c]) => y`<label
        >${r}<input
          name=${a}
          type=${c}
          step="any"
          .value=${String(this._config[a] ?? "")}
          @change=${this.changed}
      /></label>`;
    return y`${t.map(
      o
    )}${this.entityField("self_consumption_entity", e.self_consumption_entity)}${this.entityField("production_energy_entity", e.production_energy_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${n.map(
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
      >${[
      "show_breakdown",
      "show_energy_values",
      "show_money_values",
      "show_payback_date",
      "show_progress",
      "show_contribution_segments",
      "use_location_seasonality",
      "apply_annual_discount"
    ].map(
      (a) => y`<label
            ><input
              name=${a}
              type="checkbox"
              .checked=${a === "show_contribution_segments" || a === "use_location_seasonality" || a === "apply_annual_discount" ? this._config[a] === !0 : this._config[a] !== !1}
              @change=${this.changed}
            />${e[a]}</label
          >`
    )}`;
  }
  static styles = we`
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
  `;
}
customElements.define("pv-payback-card-editor", ft);
class bt extends P {
  static properties = {
    hass: { attribute: !1 },
    _config: { state: !0 },
    _scenarioDialogOpen: { state: !0 }
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
    this._comparisonDiscountRate = e.annual_discount_rate ?? 3, this._comparisonUsesDefaultRate = e.annual_discount_rate === void 0, this._config = nt(e), this._historicalStatistics = void 0, this._historicalStatisticsKey = void 0, this._calculationCache = void 0, this._scenarioCalculationCache = void 0, this.resetWarningDelay();
  }
  _historicalStatistics;
  _historicalStatisticsKey;
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
    const t = Date.now(), i = e.filter(
      (r) => r.cached && r.issueKey !== void 0
    ), n = new Set(i.map((r) => r.issueKey));
    for (const r of this._warningStartedAt.keys())
      n.has(r) || this._warningStartedAt.delete(r);
    for (const r of i)
      this._warningStartedAt.has(r.issueKey) || this._warningStartedAt.set(r.issueKey, t);
    const o = i.filter(
      (r) => t - this._warningStartedAt.get(r.issueKey) >= ye
    ), a = i.map((r) => ye - (t - this._warningStartedAt.get(r.issueKey))).filter((r) => r > 0);
    return this._warningTimer !== void 0 && clearTimeout(this._warningTimer), this._warningTimer = void 0, a.length > 0 && (this._warningTimer = setTimeout(
      () => {
        this._warningTimer = void 0, this.requestUpdate();
      },
      Math.min(...a)
    )), o;
  }
  updated() {
    const e = this._config;
    if (!e || !this.hass?.callWS || !ne(e) || (e.annual_discount_rate ?? 0) <= 0)
      return;
    const t = x(/* @__PURE__ */ new Date());
    t.setDate(t.getDate() - 1);
    const i = Ce(e, E(t));
    this._historicalStatisticsKey !== i && (this._historicalStatisticsKey = i, lt(this.hass, e)?.then((n) => {
      n && this._historicalStatisticsKey === i && (this._historicalStatistics = n, this.requestUpdate());
    }));
  }
  getCardSize() {
    return 4;
  }
  readEnergy(e, t, i) {
    const n = this.hass?.states[t], o = n ? Number(n.state) : Number.NaN, a = it(o, n?.attributes?.unit_of_measurement), r = mt(localStorage, ve(e, t)), c = gt(a, r);
    if (c.value !== void 0) {
      if (!c.cached) {
        const p = JSON.stringify({
          value: c.value,
          timestamp: n?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(ve(e, t), p);
        } catch {
        }
      }
      return {
        value: c.value,
        cached: c.cached,
        timestamp: c.cached ? r?.timestamp : n?.last_updated,
        warning: c.regression ? `${t}: ${i.counterRegression}` : void 0,
        issueKey: c.cached ? `${t}:${c.regression ? "regression" : "unavailable"}` : void 0
      };
    }
    const u = n?.attributes?.unit_of_measurement;
    return {
      cached: !1,
      warning: n && !De(u) ? `${t}: ${i.unsupportedUnit}` : `${t}: ${i.entityUnavailable}`
    };
  }
  text() {
    return tt[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
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
    }).format(e) : this.text().noProjection;
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
    const i = this.text(), n = [
      {
        name: i.scenarioLinear,
        scenario: e.linear,
        icon: "mdi:chart-line",
        className: "scenario-linear"
      },
      {
        name: i.scenarioSeasonal,
        scenario: e.seasonal,
        icon: "mdi:weather-sunny",
        className: "scenario-seasonal"
      },
      {
        name: i.scenarioDiscounted,
        scenario: e.discounted,
        icon: "mdi:percent-circle-outline",
        className: "scenario-discounted"
      }
    ];
    return y`<ha-dialog
      .open=${this._scenarioDialogOpen}
      .heading=${i.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${t ? d : y`<p class="scenario-note">${i.locationFallback}</p>`}
        ${n.map(
      ({ name: o, scenario: a, icon: r, className: c }, u) => y`<section class=${`scenario ${c}`}>
              <div class="scenario-heading">
                <ha-icon .icon=${r}></ha-icon>
                <h3>${o}</h3>
              </div>
              ${u === 2 ? y`<div class="scenario-rate">
                      ${i.discountRate}: ${this.formatPercentage(this._comparisonDiscountRate)}
                      ${this._comparisonUsesDefaultRate ? y`(${i.defaultRate})` : d}
                    </div>` : d}
              <div class="scenario-values">
                <div>
                  <span>${i.benefit}</span><strong>${this.formatMoney(a.benefit)}</strong>
                </div>
                <div>
                  <span>${i.expected}</span
                  ><strong>${this.formatDate(a.paybackDate)}</strong>
                </div>
              </div>
            </section>`
    )}
      </div>
      <ha-button slot="primaryAction" @click=${this.closeScenarioDialog}>${i.close}</ha-button>
    </ha-dialog>`;
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
    if (!e) return d;
    const t = this.text(), i = yt(e);
    if (i)
      return y`<ha-card
        ><div class="content error" role="alert">${t.invalid}: ${i}</div></ha-card
      >`;
    const n = e.self_consumption_entity ? this.readEnergy(e, e.self_consumption_entity, t) : void 0, o = !n && e.production_energy_entity ? this.readEnergy(e, e.production_energy_entity, t) : void 0, a = this.readEnergy(e, e.export_energy_entity, t), r = [n, o, a].filter(
      ($) => !!$
    ), c = this.persistentWarningReadings(r), u = n?.value, p = o?.value, l = a.value;
    if (l === void 0 || n !== void 0 && u === void 0 || o !== void 0 && p === void 0)
      return y`<ha-card
        ><div class="content error" role="alert">
          ${t.unavailable}${r.map(
        ($) => $.warning ? y`<br />${$.warning}` : d
      )}
        </div></ha-card
      >`;
    const h = u ?? p, _ = /* @__PURE__ */ new Date(), m = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude
    }, b = this._historicalStatistics ? `loaded:${this._historicalStatisticsKey ?? ""}` : `approximation:${this._historicalStatisticsKey ?? ""}`, f = JSON.stringify([
      e,
      h,
      l,
      E(_),
      m,
      b
    ]);
    this._calculationCache?.key !== f && (this._calculationCache = {
      key: f,
      calculation: j(
        e,
        h,
        l,
        _,
        m,
        be(e, this._historicalStatistics)
      )
    });
    const g = this._calculationCache.calculation;
    let A;
    if (this._scenarioDialogOpen) {
      const $ = `${f}:${this._comparisonDiscountRate}`;
      this._scenarioCalculationCache?.key !== $ && (this._scenarioCalculationCache = {
        key: $,
        scenarios: pt(
          e,
          h,
          l,
          _,
          m,
          be(e, this._historicalStatistics),
          this._comparisonDiscountRate
        )
      }), A = this._scenarioCalculationCache.scenarios;
    }
    const w = c.length > 0, v = c.map(($) => $.timestamp).filter(Boolean).sort().at(0), S = w ? `${t.cached}${v ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(v))}` : ""}${c.filter(($) => $.warning).map(($) => ` ${$.warning}`).join("")}` : void 0, ae = Math.min(
      100,
      Math.max(0, g.ownValue / e.investment_cost * 100)
    ), Me = Math.min(
      Math.max(0, 100 - ae),
      Math.max(0, g.exportValue / e.investment_cost * 100)
    ), U = e.display_style === "compact";
    return y`<ha-card>
        <div class=${`content ${U ? "compact" : "full"}`}>
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${at(e.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${S ? y`<span
                      class="warning-indicator"
                      role="img"
                      aria-label=${S}
                      title=${S}
                      ><ha-icon icon="mdi:alert"></ha-icon
                    ></span>` : d}
              ${e.show_progress ? y`<span class="header-progress">${g.progress.toFixed(1)}%</span>` : d}
            </div>
          </div>
          <div class="benefit" title=${U ? t.benefit : d}>
            <span>${t.benefit}</span
            ><strong
              class="scenario-trigger"
              role="button"
              tabindex="0"
              aria-label=${`${t.scenariosOpen}: ${t.benefit}`}
              @click=${this.openScenarioDialog}
              @keydown=${this.handleScenarioKeydown}
              >${this.formatMoney(g.benefit)}</strong
            >
          </div>
          ${e.show_progress ? y`<div
                  class="bar ${e.show_contribution_segments ? "contribution-segments" : ""}"
                  role="progressbar"
                  aria-label=${t.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow=${g.progress}
                >
                  ${e.show_contribution_segments ? y`<div
                            class="contribution-own"
                            style=${`width:${ae}%`}
                          ></div>
                          <div
                            class="contribution-export"
                            style=${`width:${Me}%`}
                          ></div>` : y`<div style=${`width:${g.progress}%`}></div>`}
                </div>` : d}
          ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? y`<div
                  class="breakdown ${e.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <div
                    class="own"
                    role=${e.self_consumption_entity ? "button" : d}
                    tabindex=${e.self_consumption_entity ? "0" : d}
                    aria-label=${t.own}
                    title=${U ? t.own : d}
                    @click=${e.self_consumption_entity ? () => this.openMoreInfo(e.self_consumption_entity) : d}
                    @keydown=${e.self_consumption_entity ? ($) => this.handleBreakdownKeydown($, e.self_consumption_entity) : d}
                  >
                    <span>${t.own}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(g.selfConsumption)} · ${this.formatMoney(g.ownValue)}` : e.show_energy_values ? this.formatEnergy(g.selfConsumption) : this.formatMoney(g.ownValue)}</b
                    >
                  </div>
                  <div
                    class="export"
                    role="button"
                    tabindex="0"
                    aria-label=${t.export}
                    title=${U ? t.export : d}
                    @click=${() => this.openMoreInfo(e.export_energy_entity)}
                    @keydown=${($) => this.handleBreakdownKeydown($, e.export_energy_entity)}
                  >
                    <span>${t.export}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(g.exported)} · ${this.formatMoney(g.exportValue)}` : e.show_energy_values ? this.formatEnergy(g.exported) : this.formatMoney(g.exportValue)}</b
                    >
                  </div>
                </div>` : d}
          ${e.show_payback_date ? y`<div class="date" title=${U ? t.expected : d}>
                  <span>${t.expected}</span
                  ><b
                    class="scenario-trigger"
                    role="button"
                    tabindex="0"
                    aria-label=${`${t.scenariosOpen}: ${t.expected}`}
                    @click=${this.openScenarioDialog}
                    @keydown=${this.handleScenarioKeydown}
                    >${this.formatDate(g.paybackDate)}</b
                  >
                </div>` : d}
        </div>
      </ha-card>
      ${this._scenarioDialogOpen && A ? this.renderScenarioDialog(
      A,
      J(m.latitude, m.longitude)
    ) : d}`;
  }
  static styles = we`
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
    .error {
      margin-top: 16px;
      color: var(--warning-color);
      font-size: 0.88em;
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
    .scenario-note,
    .scenario-values span {
      color: var(--secondary-text-color);
    }
    .scenario-note {
      margin: 0;
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
customElements.define("pv-payback-card", bt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  bt as PVPaybackCard,
  ft as PVPaybackCardEditor,
  ne as appliesAnnualDiscount,
  ve as cacheKey,
  j as calculatePayback,
  pt as calculateScenarioComparisons,
  rt as calculateSeasonalPaybackDate,
  gt as chooseEnergyValue,
  be as dailyEnergyFromStatistics,
  at as displayName,
  dt as distributeHistoricalEnergy,
  it as energyToKwh,
  Ce as historicalStatisticsCacheKey,
  lt as loadHistoricalStatistics,
  _t as parseCachedEnergy,
  mt as readCachedEnergy,
  G as statisticDailyDeltas,
  nt as withDisplayDefaults
};
