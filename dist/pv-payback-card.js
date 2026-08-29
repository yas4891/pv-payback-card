const I = globalThis, X = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = /* @__PURE__ */ Symbol(), ie = /* @__PURE__ */ new WeakMap();
let fe = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (X && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = ie.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && ie.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ke = (s) => new fe(typeof s == "string" ? s : s + "", void 0, Q), ye = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, n, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[a + 1], s[0]);
  return new fe(t, s, Q);
}, De = (s, e) => {
  if (X) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), n = I.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = t.cssText, s.appendChild(i);
  }
}, ne = X ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return ke(t);
})(s) : s;
const { is: Ce, defineProperty: Me, getOwnPropertyDescriptor: Ne, getOwnPropertyNames: Pe, getOwnPropertySymbols: Te, getPrototypeOf: Oe } = Object, L = globalThis, ae = L.trustedTypes, Ue = ae ? ae.emptyScript : "", Re = L.reactiveElementPolyfillSupport, F = (s, e) => s, G = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Ue : null;
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
} }, be = (s, e) => !Ce(s, e), oe = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: be };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = oe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(e, i, t);
      n !== void 0 && Me(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: n, set: a } = Ne(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: n, set(o) {
      const r = n?.call(this);
      a?.call(this, o), this.requestUpdate(e, r, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(F("elementProperties"))) return;
    const e = Oe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(F("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(F("properties"))) {
      const t = this.properties, i = [...Pe(t), ...Te(t)];
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
      for (const n of i) t.unshift(ne(n));
    } else e !== void 0 && t.push(ne(e));
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
    return De(e, this.constructor.elementStyles), e;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : G).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : G;
      this._$Em = n;
      const r = o.fromAttribute(t, a.type);
      this[n] = r ?? this._$Ej?.get(n) ?? r, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, n = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (n === !1 && (a = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? be)(a, t) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: n, wrapped: a }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), a !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, a] of i) {
        const { wrapped: o } = a, r = this[n];
        o !== !0 || this._$AL.has(n) || r === void 0 || this.C(n, void 0, a, r);
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
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[F("elementProperties")] = /* @__PURE__ */ new Map(), N[F("finalized")] = /* @__PURE__ */ new Map(), Re?.({ ReactiveElement: N }), (L.reactiveElementVersions ??= []).push("2.1.2");
const ee = globalThis, re = (s) => s, B = ee.trustedTypes, ce = B ? B.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, $e = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, ve = "?" + S, Fe = `<${ve}>`, M = document, H = () => M.createComment(""), W = (s) => s === null || typeof s != "object" && typeof s != "function", te = Array.isArray, He = (s) => te(s) || typeof s?.[Symbol.iterator] == "function", J = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, ue = />/g, D = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), he = /'/g, de = /"/g, we = /^(?:script|style|textarea|title)$/i, We = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), f = We(1), O = /* @__PURE__ */ Symbol.for("lit-noChange"), _ = /* @__PURE__ */ Symbol.for("lit-nothing"), pe = /* @__PURE__ */ new WeakMap(), C = M.createTreeWalker(M, 129);
function xe(s, e) {
  if (!te(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ce !== void 0 ? ce.createHTML(e) : e;
}
const ze = (s, e) => {
  const t = s.length - 1, i = [];
  let n, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = R;
  for (let r = 0; r < t; r++) {
    const c = s[r];
    let u, h, l = -1, d = 0;
    for (; d < c.length && (o.lastIndex = d, h = o.exec(c), h !== null); ) d = o.lastIndex, o === R ? h[1] === "!--" ? o = le : h[1] !== void 0 ? o = ue : h[2] !== void 0 ? (we.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = D) : h[3] !== void 0 && (o = D) : o === D ? h[0] === ">" ? (o = n ?? R, l = -1) : h[1] === void 0 ? l = -2 : (l = o.lastIndex - h[2].length, u = h[1], o = h[3] === void 0 ? D : h[3] === '"' ? de : he) : o === de || o === he ? o = D : o === le || o === ue ? o = R : (o = D, n = void 0);
    const p = o === D && s[r + 1].startsWith("/>") ? " " : "";
    a += o === R ? c + Fe : l >= 0 ? (i.push(u), c.slice(0, l) + $e + c.slice(l) + S + p) : c + S + (l === -2 ? r : p);
  }
  return [xe(s, a + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class z {
  constructor({ strings: e, _$litType$: t }, i) {
    let n;
    this.parts = [];
    let a = 0, o = 0;
    const r = e.length - 1, c = this.parts, [u, h] = ze(e, t);
    if (this.el = z.createElement(u, i), C.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (n = C.nextNode()) !== null && c.length < r; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const l of n.getAttributeNames()) if (l.endsWith($e)) {
          const d = h[o++], p = n.getAttribute(l).split(S), g = /([.?@])?(.*)/.exec(d);
          c.push({ type: 1, index: a, name: g[2], strings: p, ctor: g[1] === "." ? Ie : g[1] === "?" ? je : g[1] === "@" ? Be : K }), n.removeAttribute(l);
        } else l.startsWith(S) && (c.push({ type: 6, index: a }), n.removeAttribute(l));
        if (we.test(n.tagName)) {
          const l = n.textContent.split(S), d = l.length - 1;
          if (d > 0) {
            n.textContent = B ? B.emptyScript : "";
            for (let p = 0; p < d; p++) n.append(l[p], H()), C.nextNode(), c.push({ type: 2, index: ++a });
            n.append(l[d], H());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ve) c.push({ type: 2, index: a });
      else {
        let l = -1;
        for (; (l = n.data.indexOf(S, l + 1)) !== -1; ) c.push({ type: 7, index: a }), l += S.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const i = M.createElement("template");
    return i.innerHTML = e, i;
  }
}
function U(s, e, t = s, i) {
  if (e === O) return e;
  let n = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const a = W(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(s), n._$AT(s, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = n : t._$Cl = n), n !== void 0 && (e = U(s, n._$AS(s, e.values), n, i)), e;
}
class Ve {
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
    let a = C.nextNode(), o = 0, r = 0, c = i[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let u;
        c.type === 2 ? u = new V(a, a.nextSibling, this, e) : c.type === 1 ? u = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (u = new Le(a, this, e)), this._$AV.push(u), c = i[++r];
      }
      o !== c?.index && (a = C.nextNode(), o++);
    }
    return C.currentNode = M, n;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class V {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, n) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    e = U(this, e, t), W(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : He(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && W(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = z.createElement(xe(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(t);
    else {
      const a = new Ve(n, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = pe.get(e.strings);
    return t === void 0 && pe.set(e.strings, t = new z(e)), t;
  }
  k(e) {
    te(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, n = 0;
    for (const a of e) n === t.length ? t.push(i = new V(this.O(H()), this.O(H()), this, this.options)) : i = t[n], i._$AI(a), n++;
    n < t.length && (this._$AR(i && i._$AB.nextSibling, n), t.length = n);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = re(e).nextSibling;
      re(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class K {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, n, a) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(e, t = this, i, n) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = U(this, e, t, 0), o = !W(e) || e !== this._$AH && e !== O, o && (this._$AH = e);
    else {
      const r = e;
      let c, u;
      for (e = a[0], c = 0; c < a.length - 1; c++) u = U(this, r[i + c], t, c), u === O && (u = this._$AH[c]), o ||= !W(u) || u !== this._$AH[c], u === _ ? e = _ : e !== _ && (e += (u ?? "") + a[c + 1]), this._$AH[c] = u;
    }
    o && !n && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ie extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class je extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class Be extends K {
  constructor(e, t, i, n, a) {
    super(e, t, i, n, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = U(this, e, t, 0) ?? _) === O) return;
    const i = this._$AH, n = e === _ && i !== _ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== _ && (i === _ || n);
    n && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Le {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    U(this, e);
  }
}
const Ke = ee.litHtmlPolyfillSupport;
Ke?.(z, V), (ee.litHtmlVersions ??= []).push("3.3.3");
const qe = (s, e, t) => {
  const i = t?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const a = t?.renderBefore ?? null;
    i._$litPart$ = n = new V(e.insertBefore(H(), a), a, void 0, t ?? {});
  }
  return n._$AI(s), n;
};
const se = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = qe(t, this.renderRoot, this.renderOptions);
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
P._$litElement$ = !0, P.finalized = !0, se.litElementHydrateSupport?.({ LitElement: P });
const Je = se.litElementPolyfillSupport;
Je?.({ LitElement: P });
(se.litElementVersions ??= []).push("4.2.2");
const Ye = 365.2425, Ze = 366 * 50, _e = /* @__PURE__ */ new Map(), Ge = {
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
}, Xe = {
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
    show_contribution_segments: "Anteile im Fortschrittsbalken getrennt anzeigen",
    use_location_seasonality: "Saisonale Prognose vom Home-Assistant-Standort verwenden",
    annual_discount_rate: "Jährlicher Abzinsungssatz in Prozent",
    use_historical_statistics: "Historische Tagesstatistiken für die Abzinsung verwenden"
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
    show_contribution_segments: "Show separate contribution segments in progress bar",
    use_location_seasonality: "Use seasonal forecast from the Home Assistant location",
    annual_discount_rate: "Annual discount rate in percent",
    use_historical_statistics: "Use historical daily statistics for discounting"
  }
};
function Ae(s) {
  return s === "Wh" || s === "kWh" || s === "MWh";
}
function Qe(s, e) {
  if (!(!Number.isFinite(s) || !Ae(e)))
    return e === "Wh" ? s / 1e3 : e === "MWh" ? s * 1e3 : s;
}
function et(s) {
  return {
    ...s,
    show_breakdown: s.show_breakdown ?? !0,
    show_energy_values: s.show_energy_values ?? !0,
    show_money_values: s.show_money_values ?? !0,
    show_payback_date: s.show_payback_date ?? !0,
    show_progress: s.show_progress ?? !0,
    show_contribution_segments: s.show_contribution_segments ?? !1,
    use_location_seasonality: s.use_location_seasonality ?? !1,
    annual_discount_rate: s.annual_discount_rate ?? 0,
    use_historical_statistics: s.use_historical_statistics ?? !1
  };
}
function tt(s, e) {
  return !s || s === "PV-Amortisation" ? e : s;
}
function st(s, e, t, i) {
  if (t <= 0 || s > e) return;
  const n = Math.max(1, (e.getTime() - s.getTime()) / 864e5);
  return new Date(s.getTime() + i / t * n * 864e5);
}
function w(s) {
  return new Date(s.getFullYear(), s.getMonth(), s.getDate());
}
function T(s, e) {
  const t = new Date(s.getFullYear(), 0, 0), i = Math.round((w(s).getTime() - t.getTime()) / 864e5), n = e * Math.PI / 180, a = 0.409 * Math.sin(2 * Math.PI * i / 365 - 1.39), o = -Math.tan(n) * Math.tan(a), r = Math.acos(Math.max(-1, Math.min(1, o))), c = r * Math.sin(n) * Math.sin(a) + Math.cos(n) * Math.cos(a) * Math.sin(r);
  return Math.max(0, c);
}
function it(s, e, t, i, n) {
  const a = /* @__PURE__ */ new Date(`${s}T00:00:00`);
  if (Number.isNaN(a.getTime()) || !Number.isFinite(e.getTime()) || !Number.isFinite(t) || t <= 0 || !Number.isFinite(i) || i <= 0 || !Number.isFinite(n) || n < -90 || n > 90 || a > e)
    return;
  const o = w(e);
  let r = 0;
  for (let p = w(a); p <= o; p.setDate(p.getDate() + 1))
    r += T(p, n);
  if (!Number.isFinite(r) || r <= 0) return;
  const c = t / r, u = Math.max(1e-9, i * Number.EPSILON * 16);
  if (t >= i) {
    let p = 0;
    for (let g = w(a); g <= o; g.setDate(g.getDate() + 1))
      if (p += T(g, n) * c, p >= i - u) return new Date(g);
    return;
  }
  let h = t;
  const l = new Date(o), d = 366 * 50;
  for (let p = 0; p < d; p += 1) {
    if (h >= i - u) return new Date(l);
    l.setDate(l.getDate() + 1), h += T(l, n) * c;
  }
}
function q(s, e) {
  return typeof s == "number" && Number.isFinite(s) && s >= -90 && s <= 90 && typeof e == "number" && Number.isFinite(e) && e >= -180 && e <= 180;
}
function E(s) {
  return [
    s.getFullYear(),
    String(s.getMonth() + 1).padStart(2, "0"),
    String(s.getDate()).padStart(2, "0")
  ].join("-");
}
function Y(s, e, t) {
  const i = Math.max(
    0,
    (w(s).getTime() - w(e).getTime()) / 864e5
  );
  return 1 / (1 + t / 100) ** (i / Ye);
}
function nt(s) {
  const e = s.start ?? s.start_time;
  if (typeof e == "number")
    return !Number.isFinite(e) || Number.isNaN(new Date(e).getTime()) ? void 0 : E(new Date(e));
  if (!(typeof e != "string" || Number.isNaN(new Date(e).getTime())))
    return e.slice(0, 10);
}
function Z(s) {
  const e = /* @__PURE__ */ new Map();
  let t;
  for (const i of s ?? []) {
    const n = nt(i), a = typeof i.sum == "number" ? i.sum : Number.NaN;
    if (!n || !Number.isFinite(a)) {
      t = void 0;
      continue;
    }
    if (t !== void 0) {
      const o = a - t;
      o >= 0 && e.set(n, o);
    }
    t = a;
  }
  return e;
}
function me(s, e) {
  const t = Z(e?.[s.export_energy_entity]), i = s.self_consumption_entity ? Z(e?.[s.self_consumption_entity]) : void 0, n = s.production_energy_entity ? Z(e?.[s.production_energy_entity]) : void 0;
  return [.../* @__PURE__ */ new Set([
    ...t.keys(),
    ...i?.keys() ?? [],
    ...n?.keys() ?? []
  ])].sort().flatMap((o) => {
    const r = t.get(o);
    if (r === void 0) return [];
    const c = i ? i.get(o) : n?.get(o) === void 0 ? void 0 : Math.max(0, n.get(o) - r);
    return c === void 0 || !Number.isFinite(c) || c < 0 ? [] : [{ date: o, selfConsumption: c, exported: r }];
  });
}
function Se(s, e) {
  const t = s.self_consumption_entity ? ["direct", s.self_consumption_entity, s.export_energy_entity] : ["derived", s.production_energy_entity, s.export_energy_entity];
  return JSON.stringify([t, s.start_date, e]);
}
function at(s, e, t = /* @__PURE__ */ new Date()) {
  if (!s.callWS || !e.use_historical_statistics || (e.annual_discount_rate ?? 0) <= 0)
    return;
  const i = /* @__PURE__ */ new Date(`${e.start_date}T00:00:00`);
  if (Number.isNaN(i.getTime()) || Number.isNaN(t.getTime())) return;
  const n = w(i);
  n.setDate(n.getDate() - 1);
  const a = w(t), o = w(t);
  o.setDate(o.getDate() - 1);
  const r = E(o), c = Se(e, r), u = _e.get(c);
  if (u) return u;
  const h = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity], l = s.callWS({
    type: "recorder/statistics_during_period",
    start_time: `${E(n)}T00:00:00`,
    end_time: `${E(a)}T00:00:00`,
    statistic_ids: h,
    period: "day",
    types: ["sum"]
  }).then(
    (d) => d && typeof d == "object" ? d : void 0
  ).catch(() => {
  });
  return _e.set(c, l), l;
}
function ot(s, e, t, i) {
  const n = s.use_location_seasonality && q(i?.latitude, i?.longitude), a = [];
  for (let r = w(e); r <= w(t); r.setDate(r.getDate() + 1))
    a.push({
      date: new Date(r),
      weight: n ? T(r, i.latitude) : 1
    });
  return a.reduce((r, c) => r + c.weight, 0) > 0 ? a : a.map((r) => ({ ...r, weight: 1 }));
}
function rt(s, e, t, i, n, a) {
  const o = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`);
  if (Number.isNaN(o.getTime()) || o > i) return [];
  const r = ot(s, o, i, n), c = new Map((a ?? []).map((d) => [d.date, d])), u = (d, p) => {
    const g = r.map(
      ({ date: v }) => Math.max(0, c.get(E(v))?.[p] ?? 0)
    ), y = g.reduce((v, $) => v + $, 0), m = r.reduce(
      (v, $, k) => v + (g[k] > 0 ? 0 : $.weight),
      0
    ), x = r.map((v, $) => y > 0 && g[$] > 0 ? g[$] : m > 0 ? d * v.weight / m : 0), A = x.reduce((v, $) => v + $, 0);
    return A > 0 ? x.map((v) => v * d / A) : x;
  }, h = u(Math.max(0, e), "selfConsumption"), l = u(Math.max(0, t), "exported");
  return r.map((d, p) => ({
    date: E(d.date),
    selfConsumption: h[p],
    exported: l[p]
  }));
}
function ct(s, e, t, i) {
  const n = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`), a = s.annual_discount_rate ?? 0;
  let o = 0, r = 0, c = 0, u;
  for (const y of t) {
    const m = /* @__PURE__ */ new Date(`${y.date}T00:00:00`), x = y.selfConsumption * s.electricity_price * Y(m, n, a), A = y.exported * s.feed_in_tariff * Y(m, n, a);
    o += x, r += A, c += x + A, !u && c >= s.investment_cost && (u = m);
  }
  if (u) return { ownValue: o, exportValue: r, paybackDate: u };
  const h = s.use_location_seasonality && q(i?.latitude, i?.longitude), l = t.reduce(
    (y, m) => y + (h ? T(/* @__PURE__ */ new Date(`${m.date}T00:00:00`), i.latitude) : 1),
    0
  ), d = t.reduce(
    (y, m) => y + m.selfConsumption * s.electricity_price + m.exported * s.feed_in_tariff,
    0
  );
  if (l <= 0 || d <= 0) return { ownValue: o, exportValue: r };
  const p = d / l, g = w(e);
  for (let y = 0; y < Ze; y += 1) {
    g.setDate(g.getDate() + 1);
    const m = h ? T(g, i.latitude) : 1;
    if (c += p * m * Y(g, n, a), c >= s.investment_cost)
      return { ownValue: o, exportValue: r, paybackDate: new Date(g) };
  }
  return { ownValue: o, exportValue: r };
}
function j(s, e, t, i = /* @__PURE__ */ new Date(), n, a) {
  const o = Math.max(0, e - (s.self_consumption_baseline ?? 0)), r = Math.max(0, t - (s.export_energy_baseline ?? 0)), c = o * s.electricity_price, u = r * s.feed_in_tariff;
  if ((s.annual_discount_rate ?? 0) > 0) {
    const v = rt(
      s,
      o,
      r,
      i,
      n,
      a
    ), $ = ct(s, i, v, n), k = $.ownValue + $.exportValue;
    return {
      selfConsumption: o,
      exported: r,
      ownValue: $.ownValue,
      exportValue: $.exportValue,
      benefit: k,
      progress: Math.min(100, k / s.investment_cost * 100),
      paybackDate: $.paybackDate
    };
  }
  const h = c, l = u, d = h + l, p = Math.min(100, d / s.investment_cost * 100), g = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`), y = st(g, i, d, s.investment_cost), m = n?.latitude, x = n?.longitude, A = s.use_location_seasonality && q(m, x) ? it(
    s.start_date,
    i,
    d,
    s.investment_cost,
    m
  ) ?? y : y;
  return {
    selfConsumption: o,
    exported: r,
    ownValue: h,
    exportValue: l,
    benefit: d,
    progress: p,
    paybackDate: A
  };
}
function lt(s, e, t, i = /* @__PURE__ */ new Date(), n, a, o = s.annual_discount_rate ?? 3) {
  const r = { ...s, use_historical_statistics: !1 };
  return {
    linear: j(
      { ...r, use_location_seasonality: !1, annual_discount_rate: 0 },
      e,
      t,
      i,
      n,
      a
    ),
    seasonal: j(
      { ...r, use_location_seasonality: !0, annual_discount_rate: 0 },
      e,
      t,
      i,
      n,
      a
    ),
    discounted: j(
      {
        ...r,
        use_location_seasonality: !0,
        annual_discount_rate: o
      },
      e,
      t,
      i,
      n,
      a
    )
  };
}
function ge(s, e) {
  const t = !!s.self_consumption_entity;
  return `pv-payback-card:last-valid:${JSON.stringify([
    t ? "direct-self-consumption" : "derived-self-consumption",
    t ? s.self_consumption_entity : s.production_energy_entity,
    s.export_energy_entity,
    s.start_date,
    s.self_consumption_baseline ?? 0,
    s.export_energy_baseline ?? 0
  ])}:${e}`;
}
function ut(s) {
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
function ht(s, e) {
  try {
    return ut(s.getItem(e));
  } catch {
    return;
  }
}
function dt(s, e) {
  return s !== void 0 && s >= 0 ? e && s < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: s, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function pt(s) {
  if (!s.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${s.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const e of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(s[e]) || s[e] < 0) return e;
  if (s.investment_cost <= 0) return "investment_cost";
  if (!Number.isFinite(s.annual_discount_rate ?? 0) || (s.annual_discount_rate ?? 0) < 0)
    return "annual_discount_rate";
  if (!s.export_energy_entity || !s.self_consumption_entity && !s.production_energy_entity)
    return "energy entity";
}
class _t extends P {
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
    const e = Xe[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
      ["start_date", e.start_date, "date"],
      ["investment_cost", e.investment_cost, "number"],
      ["electricity_price", e.electricity_price, "number"],
      ["feed_in_tariff", e.feed_in_tariff, "number"]
    ], i = [
      ["self_consumption_baseline", e.self_consumption_baseline, "number"],
      ["export_energy_baseline", e.export_energy_baseline, "number"],
      ["annual_discount_rate", e.annual_discount_rate, "number"]
    ], n = ([a, o, r]) => f`<label
        >${o}<input
          name=${a}
          type=${r}
          step="any"
          .value=${String(this._config[a] ?? "")}
          @change=${this.changed}
      /></label>`;
    return f`${t.map(
      n
    )}${this.entityField("self_consumption_entity", e.self_consumption_entity)}${this.entityField("production_energy_entity", e.production_energy_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${i.map(
      n
    )}${[
      "show_breakdown",
      "show_energy_values",
      "show_money_values",
      "show_payback_date",
      "show_progress",
      "show_contribution_segments",
      "use_location_seasonality",
      "use_historical_statistics"
    ].map(
      (a) => f`<label
          ><input
            name=${a}
            type="checkbox"
            .checked=${a === "show_contribution_segments" || a === "use_location_seasonality" || a === "use_historical_statistics" ? this._config[a] === !0 : this._config[a] !== !1}
            @change=${this.changed}
          />${e[a]}</label
        >`
    )}`;
  }
  static styles = ye`
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
customElements.define("pv-payback-card-editor", _t);
class mt extends P {
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
      show_breakdown: !0,
      show_energy_values: !0,
      show_money_values: !0,
      show_payback_date: !0,
      show_progress: !0,
      show_contribution_segments: !1,
      use_location_seasonality: !1,
      annual_discount_rate: 0,
      use_historical_statistics: !1
    };
  }
  static getConfigElement() {
    return document.createElement("pv-payback-card-editor");
  }
  setConfig(e) {
    this._comparisonDiscountRate = e.annual_discount_rate ?? 3, this._comparisonUsesDefaultRate = e.annual_discount_rate === void 0, this._config = et(e), this._historicalStatistics = void 0, this._historicalStatisticsKey = void 0, this._calculationCache = void 0, this._scenarioCalculationCache = void 0;
  }
  _historicalStatistics;
  _historicalStatisticsKey;
  _calculationCache;
  _scenarioCalculationCache;
  _comparisonDiscountRate = 3;
  _comparisonUsesDefaultRate = !0;
  updated() {
    const e = this._config;
    if (!e || !this.hass?.callWS || !e.use_historical_statistics || (e.annual_discount_rate ?? 0) <= 0)
      return;
    const t = w(/* @__PURE__ */ new Date());
    t.setDate(t.getDate() - 1);
    const i = Se(e, E(t));
    this._historicalStatisticsKey !== i && (this._historicalStatisticsKey = i, at(this.hass, e)?.then((n) => {
      n && this._historicalStatisticsKey === i && (this._historicalStatistics = n, this.requestUpdate());
    }));
  }
  getCardSize() {
    return 4;
  }
  readEnergy(e, t, i) {
    const n = this.hass?.states[t], a = n ? Number(n.state) : Number.NaN, o = Qe(a, n?.attributes?.unit_of_measurement), r = ht(localStorage, ge(e, t)), c = dt(o, r);
    if (c.value !== void 0) {
      if (!c.cached) {
        const h = JSON.stringify({
          value: c.value,
          timestamp: n?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(ge(e, t), h);
        } catch {
        }
      }
      return {
        value: c.value,
        cached: c.cached,
        timestamp: c.cached ? r?.timestamp : n?.last_updated,
        warning: c.regression ? `${t}: ${i.counterRegression}` : void 0
      };
    }
    const u = n?.attributes?.unit_of_measurement;
    return {
      cached: !1,
      warning: n && !Ae(u) ? `${t}: ${i.unsupportedUnit}` : `${t}: ${i.entityUnavailable}`
    };
  }
  text() {
    return Ge[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
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
      [i.scenarioLinear, e.linear],
      [i.scenarioSeasonal, e.seasonal],
      [i.scenarioDiscounted, e.discounted]
    ];
    return f`<ha-dialog
      .open=${this._scenarioDialogOpen}
      .heading=${i.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${t ? _ : f`<p class="scenario-note">${i.locationFallback}</p>`}
        ${n.map(
      ([a, o], r) => f`<section class="scenario">
              <h3>${a}</h3>
              ${r === 2 ? f`<div class="scenario-rate">
                      ${i.discountRate}: ${this.formatPercentage(this._comparisonDiscountRate)}
                      ${this._comparisonUsesDefaultRate ? f`(${i.defaultRate})` : _}
                    </div>` : _}
              <div class="scenario-values">
                <div>
                  <span>${i.benefit}</span><strong>${this.formatMoney(o.benefit)}</strong>
                </div>
                <div>
                  <span>${i.expected}</span
                  ><strong>${this.formatDate(o.paybackDate)}</strong>
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
    if (!e) return _;
    const t = this.text(), i = pt(e);
    if (i)
      return f`<ha-card
        ><div class="content error" role="alert">${t.invalid}: ${i}</div></ha-card
      >`;
    const n = e.self_consumption_entity ? this.readEnergy(e, e.self_consumption_entity, t) : void 0, a = !n && e.production_energy_entity ? this.readEnergy(e, e.production_energy_entity, t) : void 0, o = this.readEnergy(e, e.export_energy_entity, t), r = [n, a, o].filter(
      (b) => !!b
    ), c = n?.value, u = a?.value, h = o.value;
    if (h === void 0 || n !== void 0 && c === void 0 || a !== void 0 && u === void 0)
      return f`<ha-card
        ><div class="content error" role="alert">
          ${t.unavailable}${r.map(
        (b) => b.warning ? f`<br />${b.warning}` : _
      )}
        </div></ha-card
      >`;
    const l = c ?? u - h, d = /* @__PURE__ */ new Date(), p = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude
    }, g = this._historicalStatistics ? `loaded:${this._historicalStatisticsKey ?? ""}` : `approximation:${this._historicalStatisticsKey ?? ""}`, y = JSON.stringify([
      e,
      l,
      h,
      E(d),
      p,
      g
    ]);
    this._calculationCache?.key !== y && (this._calculationCache = {
      key: y,
      calculation: j(
        e,
        l,
        h,
        d,
        p,
        me(e, this._historicalStatistics)
      )
    });
    const m = this._calculationCache.calculation;
    let x;
    if (this._scenarioDialogOpen) {
      const b = `${y}:${this._comparisonDiscountRate}`;
      this._scenarioCalculationCache?.key !== b && (this._scenarioCalculationCache = {
        key: b,
        scenarios: lt(
          e,
          l,
          h,
          d,
          p,
          me(e, this._historicalStatistics),
          this._comparisonDiscountRate
        )
      }), x = this._scenarioCalculationCache.scenarios;
    }
    const A = r.some((b) => b.cached), v = r.map((b) => b.timestamp).filter(Boolean).sort().at(0), $ = A ? `${t.cached}${v ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(v))}` : ""}${r.filter((b) => b.warning).map((b) => ` ${b.warning}`).join("")}` : void 0, k = Math.min(
      100,
      Math.max(0, m.ownValue / e.investment_cost * 100)
    ), Ee = Math.min(
      Math.max(0, 100 - k),
      Math.max(0, m.exportValue / e.investment_cost * 100)
    );
    return f`<ha-card>
        <div class="content">
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${tt(e.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${$ ? f`<span
                      class="warning-indicator"
                      role="img"
                      aria-label=${$}
                      title=${$}
                      ><ha-icon icon="mdi:alert"></ha-icon
                    ></span>` : _}
              ${e.show_progress ? f`<span class="header-progress">${m.progress.toFixed(1)}%</span>` : _}
            </div>
          </div>
          <div class="benefit">
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
                            style=${`width:${k}%`}
                          ></div>
                          <div
                            class="contribution-export"
                            style=${`width:${Ee}%`}
                          ></div>` : f`<div style=${`width:${m.progress}%`}></div>`}
                </div>` : _}
          ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? f`<div
                  class="breakdown ${e.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <div
                    class="own"
                    role=${e.self_consumption_entity ? "button" : _}
                    tabindex=${e.self_consumption_entity ? "0" : _}
                    aria-label=${e.self_consumption_entity ? t.own : _}
                    @click=${e.self_consumption_entity ? () => this.openMoreInfo(e.self_consumption_entity) : _}
                    @keydown=${e.self_consumption_entity ? (b) => this.handleBreakdownKeydown(b, e.self_consumption_entity) : _}
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
                    @click=${() => this.openMoreInfo(e.export_energy_entity)}
                    @keydown=${(b) => this.handleBreakdownKeydown(b, e.export_energy_entity)}
                  >
                    <span>${t.export}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(m.exported)} · ${this.formatMoney(m.exportValue)}` : e.show_energy_values ? this.formatEnergy(m.exported) : this.formatMoney(m.exportValue)}</b
                    >
                  </div>
                </div>` : _}
          ${e.show_payback_date ? f`<div class="date">
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
                </div>` : _}
        </div>
      </ha-card>
      ${this._scenarioDialogOpen && x ? this.renderScenarioDialog(
      x,
      q(p.latitude, p.longitude)
    ) : _}`;
  }
  static styles = ye`
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
    .scenario-dialog {
      display: grid;
      gap: 12px;
      min-width: min(520px, 75vw);
      padding-bottom: 8px;
    }
    .scenario {
      padding: 14px;
      background: var(--secondary-background-color);
      border-radius: 12px;
    }
    .scenario h3 {
      margin: 0 0 10px;
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
customElements.define("pv-payback-card", mt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  mt as PVPaybackCard,
  _t as PVPaybackCardEditor,
  ge as cacheKey,
  j as calculatePayback,
  lt as calculateScenarioComparisons,
  it as calculateSeasonalPaybackDate,
  dt as chooseEnergyValue,
  me as dailyEnergyFromStatistics,
  tt as displayName,
  rt as distributeHistoricalEnergy,
  Qe as energyToKwh,
  Se as historicalStatisticsCacheKey,
  at as loadHistoricalStatistics,
  ut as parseCachedEnergy,
  ht as readCachedEnergy,
  Z as statisticDailyDeltas,
  et as withDisplayDefaults
};
