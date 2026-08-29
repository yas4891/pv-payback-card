const K = globalThis, X = K.ShadowRoot && (K.ShadyCSS === void 0 || K.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = /* @__PURE__ */ Symbol(), ae = /* @__PURE__ */ new WeakMap();
let ve = class {
  constructor(e, t, n) {
    if (this._$cssResult$ = !0, n !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (X && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      n && (e = ae.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ae.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Me = (s) => new ve(typeof s == "string" ? s : s + "", void 0, Q), $e = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((n, i, o) => n + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[o + 1], s[0]);
  return new ve(t, s, Q);
}, Ne = (s, e) => {
  if (X) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const n = document.createElement("style"), i = K.litNonce;
    i !== void 0 && n.setAttribute("nonce", i), n.textContent = t.cssText, s.appendChild(n);
  }
}, oe = X ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const n of e.cssRules) t += n.cssText;
  return Me(t);
})(s) : s;
const { is: Pe, defineProperty: Te, getOwnPropertyDescriptor: Oe, getOwnPropertyNames: Re, getOwnPropertySymbols: Ue, getPrototypeOf: We } = Object, j = globalThis, re = j.trustedTypes, Fe = re ? re.emptyScript : "", Ve = j.reactiveElementPolyfillSupport, W = (s, e) => s, G = { toAttribute(s, e) {
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
} }, we = (s, e) => !Pe(s, e), ce = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: we };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), j.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ce) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const n = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, n, t);
      i !== void 0 && Te(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: i, set: o } = Oe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: i, set(a) {
      const r = i?.call(this);
      o?.call(this, a), this.requestUpdate(e, r, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const e = We(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const t = this.properties, n = [...Re(t), ...Ue(t)];
      for (const i of n) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [n, i] of t) this.elementProperties.set(n, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, n] of this.elementProperties) {
      const i = this._$Eu(t, n);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const i of n) t.unshift(oe(i));
    } else e !== void 0 && t.push(oe(e));
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
    return Ne(e, this.constructor.elementStyles), e;
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
    const n = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, n);
    if (i !== void 0 && n.reflect === !0) {
      const o = (n.converter?.toAttribute !== void 0 ? n.converter : G).toAttribute(t, n.type);
      this._$Em = e, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const n = this.constructor, i = n._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const o = n.getPropertyOptions(i), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : G;
      this._$Em = i;
      const r = a.fromAttribute(t, o.type);
      this[i] = r ?? this._$Ej?.get(i) ?? r, this._$Em = null;
    }
  }
  requestUpdate(e, t, n, i = !1, o) {
    if (e !== void 0) {
      const a = this.constructor;
      if (i === !1 && (o = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? we)(o, t) || n.useDefault && n.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: n, reflect: i, wrapped: o }, a) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), o !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [i, o] of n) {
        const { wrapped: a } = o, r = this[i];
        a !== !0 || this._$AL.has(i) || r === void 0 || this.C(i, void 0, o, r);
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
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[W("elementProperties")] = /* @__PURE__ */ new Map(), N[W("finalized")] = /* @__PURE__ */ new Map(), Ve?.({ ReactiveElement: N }), (j.reactiveElementVersions ??= []).push("2.1.2");
const ee = globalThis, le = (s) => s, B = ee.trustedTypes, ue = B ? B.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, xe = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Ae = "?" + k, ze = `<${Ae}>`, M = document, F = () => M.createComment(""), V = (s) => s === null || typeof s != "object" && typeof s != "function", te = Array.isArray, He = (s) => te(s) || typeof s?.[Symbol.iterator] == "function", J = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, de = />/g, D = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, _e = /"/g, Se = /^(?:script|style|textarea|title)$/i, Ke = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), y = Ke(1), O = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), ge = /* @__PURE__ */ new WeakMap(), C = M.createTreeWalker(M, 129);
function ke(s, e) {
  if (!te(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ue !== void 0 ? ue.createHTML(e) : e;
}
const Ie = (s, e) => {
  const t = s.length - 1, n = [];
  let i, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = U;
  for (let r = 0; r < t; r++) {
    const c = s[r];
    let u, d, l = -1, h = 0;
    for (; h < c.length && (a.lastIndex = h, d = a.exec(c), d !== null); ) h = a.lastIndex, a === U ? d[1] === "!--" ? a = he : d[1] !== void 0 ? a = de : d[2] !== void 0 ? (Se.test(d[2]) && (i = RegExp("</" + d[2], "g")), a = D) : d[3] !== void 0 && (a = D) : a === D ? d[0] === ">" ? (a = i ?? U, l = -1) : d[1] === void 0 ? l = -2 : (l = a.lastIndex - d[2].length, u = d[1], a = d[3] === void 0 ? D : d[3] === '"' ? _e : pe) : a === _e || a === pe ? a = D : a === he || a === de ? a = U : (a = D, i = void 0);
    const _ = a === D && s[r + 1].startsWith("/>") ? " " : "";
    o += a === U ? c + ze : l >= 0 ? (n.push(u), c.slice(0, l) + xe + c.slice(l) + k + _) : c + k + (l === -2 ? r : _);
  }
  return [ke(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class z {
  constructor({ strings: e, _$litType$: t }, n) {
    let i;
    this.parts = [];
    let o = 0, a = 0;
    const r = e.length - 1, c = this.parts, [u, d] = Ie(e, t);
    if (this.el = z.createElement(u, n), C.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (i = C.nextNode()) !== null && c.length < r; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const l of i.getAttributeNames()) if (l.endsWith(xe)) {
          const h = d[a++], _ = i.getAttribute(l).split(k), g = /([.?@])?(.*)/.exec(h);
          c.push({ type: 1, index: o, name: g[2], strings: _, ctor: g[1] === "." ? je : g[1] === "?" ? Le : g[1] === "@" ? qe : L }), i.removeAttribute(l);
        } else l.startsWith(k) && (c.push({ type: 6, index: o }), i.removeAttribute(l));
        if (Se.test(i.tagName)) {
          const l = i.textContent.split(k), h = l.length - 1;
          if (h > 0) {
            i.textContent = B ? B.emptyScript : "";
            for (let _ = 0; _ < h; _++) i.append(l[_], F()), C.nextNode(), c.push({ type: 2, index: ++o });
            i.append(l[h], F());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ae) c.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = i.data.indexOf(k, l + 1)) !== -1; ) c.push({ type: 7, index: o }), l += k.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const n = M.createElement("template");
    return n.innerHTML = e, n;
  }
}
function R(s, e, t = s, n) {
  if (e === O) return e;
  let i = n !== void 0 ? t._$Co?.[n] : t._$Cl;
  const o = V(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(s), i._$AT(s, t, n)), n !== void 0 ? (t._$Co ??= [])[n] = i : t._$Cl = i), i !== void 0 && (e = R(s, i._$AS(s, e.values), i, n)), e;
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
    const { el: { content: t }, parts: n } = this._$AD, i = (e?.creationScope ?? M).importNode(t, !0);
    C.currentNode = i;
    let o = C.nextNode(), a = 0, r = 0, c = n[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let u;
        c.type === 2 ? u = new H(o, o.nextSibling, this, e) : c.type === 1 ? u = new c.ctor(o, c.name, c.strings, this, e) : c.type === 6 && (u = new Je(o, this, e)), this._$AV.push(u), c = n[++r];
      }
      a !== c?.index && (o = C.nextNode(), a++);
    }
    return C.currentNode = M, i;
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), t += n.strings.length - 2) : n._$AI(e[t])), t++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, n, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    e = R(this, e, t), V(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : He(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && V(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: n } = e, i = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = z.createElement(ke(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const o = new Be(i, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ge.get(e.strings);
    return t === void 0 && ge.set(e.strings, t = new z(e)), t;
  }
  k(e) {
    te(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let n, i = 0;
    for (const o of e) i === t.length ? t.push(n = new H(this.O(F()), this.O(F()), this, this.options)) : n = t[i], n._$AI(o), i++;
    i < t.length && (this._$AR(n && n._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const n = le(e).nextSibling;
      le(e).remove(), e = n;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, i, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = o, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = p;
  }
  _$AI(e, t = this, n, i) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) e = R(this, e, t, 0), a = !V(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
    else {
      const r = e;
      let c, u;
      for (e = o[0], c = 0; c < o.length - 1; c++) u = R(this, r[n + c], t, c), u === O && (u = this._$AH[c]), a ||= !V(u) || u !== this._$AH[c], u === p ? e = p : e !== p && (e += (u ?? "") + o[c + 1]), this._$AH[c] = u;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class je extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class Le extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class qe extends L {
  constructor(e, t, n, i, o) {
    super(e, t, n, i, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = R(this, e, t, 0) ?? p) === O) return;
    const n = this._$AH, i = e === p && n !== p || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, o = e !== p && (n === p || i);
    i && this.element.removeEventListener(this.name, this, n), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Je {
  constructor(e, t, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    R(this, e);
  }
}
const Ye = ee.litHtmlPolyfillSupport;
Ye?.(z, H), (ee.litHtmlVersions ??= []).push("3.3.3");
const Ze = (s, e, t) => {
  const n = t?.renderBefore ?? e;
  let i = n._$litPart$;
  if (i === void 0) {
    const o = t?.renderBefore ?? null;
    n._$litPart$ = i = new H(e.insertBefore(F(), o), o, void 0, t ?? {});
  }
  return i._$AI(s), i;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ze(t, this.renderRoot, this.renderOptions);
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
const Ge = se.litElementPolyfillSupport;
Ge?.({ LitElement: P });
(se.litElementVersions ??= []).push("4.2.2");
const Xe = 365.2425, Qe = 366 * 50, me = 180 * 1e3, ye = /* @__PURE__ */ new Map(), et = {
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
}, tt = {
  de: {
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
function Ee(s) {
  return s === "Wh" || s === "kWh" || s === "MWh";
}
function st(s, e) {
  if (!(!Number.isFinite(s) || !Ee(e)))
    return e === "Wh" ? s / 1e3 : e === "MWh" ? s * 1e3 : s;
}
function nt(s) {
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
    apply_annual_discount: s.apply_annual_discount ?? s.use_historical_statistics ?? !1
  };
}
function ne(s) {
  return s.apply_annual_discount ?? s.use_historical_statistics ?? !1;
}
function it(s, e) {
  return !s || s === "PV-Amortisation" ? e : s;
}
function at(s, e, t, n) {
  if (t <= 0 || s > e) return;
  const i = Math.max(1, (e.getTime() - s.getTime()) / 864e5);
  return new Date(s.getTime() + n / t * i * 864e5);
}
function x(s) {
  return new Date(s.getFullYear(), s.getMonth(), s.getDate());
}
function T(s, e) {
  const t = new Date(s.getFullYear(), 0, 0), n = Math.round((x(s).getTime() - t.getTime()) / 864e5), i = e * Math.PI / 180, o = 0.409 * Math.sin(2 * Math.PI * n / 365 - 1.39), a = -Math.tan(i) * Math.tan(o), r = Math.acos(Math.max(-1, Math.min(1, a))), c = r * Math.sin(i) * Math.sin(o) + Math.cos(i) * Math.cos(o) * Math.sin(r);
  return Math.max(0, c);
}
function ot(s, e, t, n, i) {
  const o = /* @__PURE__ */ new Date(`${s}T00:00:00`);
  if (Number.isNaN(o.getTime()) || !Number.isFinite(e.getTime()) || !Number.isFinite(t) || t <= 0 || !Number.isFinite(n) || n <= 0 || !Number.isFinite(i) || i < -90 || i > 90 || o > e)
    return;
  const a = x(e);
  let r = 0;
  for (let _ = x(o); _ <= a; _.setDate(_.getDate() + 1))
    r += T(_, i);
  if (!Number.isFinite(r) || r <= 0) return;
  const c = t / r, u = Math.max(1e-9, n * Number.EPSILON * 16);
  if (t >= n) {
    let _ = 0;
    for (let g = x(o); g <= a; g.setDate(g.getDate() + 1))
      if (_ += T(g, i) * c, _ >= n - u) return new Date(g);
    return;
  }
  let d = t;
  const l = new Date(a), h = 366 * 50;
  for (let _ = 0; _ < h; _ += 1) {
    if (d >= n - u) return new Date(l);
    l.setDate(l.getDate() + 1), d += T(l, i) * c;
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
  const n = Math.max(
    0,
    (x(s).getTime() - x(e).getTime()) / 864e5
  );
  return 1 / (1 + t / 100) ** (n / Xe);
}
function rt(s) {
  const e = s.start ?? s.start_time;
  if (typeof e == "number")
    return !Number.isFinite(e) || Number.isNaN(new Date(e).getTime()) ? void 0 : E(new Date(e));
  if (!(typeof e != "string" || Number.isNaN(new Date(e).getTime())))
    return e.slice(0, 10);
}
function Z(s) {
  const e = /* @__PURE__ */ new Map();
  let t;
  for (const n of s ?? []) {
    const i = rt(n), o = typeof n.sum == "number" ? n.sum : Number.NaN;
    if (!i || !Number.isFinite(o)) {
      t = void 0;
      continue;
    }
    if (t !== void 0) {
      const a = o - t;
      a >= 0 && e.set(i, a);
    }
    t = o;
  }
  return e;
}
function fe(s, e) {
  const t = Z(e?.[s.export_energy_entity]), n = s.self_consumption_entity ? Z(e?.[s.self_consumption_entity]) : void 0, i = s.production_energy_entity ? Z(e?.[s.production_energy_entity]) : void 0;
  return [.../* @__PURE__ */ new Set([
    ...t.keys(),
    ...n?.keys() ?? [],
    ...i?.keys() ?? []
  ])].sort().flatMap((a) => {
    const r = t.get(a);
    if (r === void 0) return [];
    const c = n ? n.get(a) : i?.get(a) === void 0 ? void 0 : Math.max(0, i.get(a) - r);
    return c === void 0 || !Number.isFinite(c) || c < 0 ? [] : [{ date: a, selfConsumption: c, exported: r }];
  });
}
function De(s, e) {
  const t = s.self_consumption_entity ? ["direct", s.self_consumption_entity, s.export_energy_entity] : ["derived", s.production_energy_entity, s.export_energy_entity];
  return JSON.stringify([t, s.start_date, e]);
}
function ct(s, e, t = /* @__PURE__ */ new Date()) {
  if (!s.callWS || !ne(e) || (e.annual_discount_rate ?? 0) <= 0)
    return;
  const n = /* @__PURE__ */ new Date(`${e.start_date}T00:00:00`);
  if (Number.isNaN(n.getTime()) || Number.isNaN(t.getTime())) return;
  const i = x(n);
  i.setDate(i.getDate() - 1);
  const o = x(t), a = x(t);
  a.setDate(a.getDate() - 1);
  const r = E(a), c = De(e, r), u = ye.get(c);
  if (u) return u;
  const d = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity], l = s.callWS({
    type: "recorder/statistics_during_period",
    start_time: `${E(i)}T00:00:00`,
    end_time: `${E(o)}T00:00:00`,
    statistic_ids: d,
    period: "day",
    types: ["sum"]
  }).then(
    (h) => h && typeof h == "object" ? h : void 0
  ).catch(() => {
  });
  return ye.set(c, l), l;
}
function lt(s, e, t, n) {
  const i = s.use_location_seasonality && q(n?.latitude, n?.longitude), o = [];
  for (let r = x(e); r <= x(t); r.setDate(r.getDate() + 1))
    o.push({
      date: new Date(r),
      weight: i ? T(r, n.latitude) : 1
    });
  return o.reduce((r, c) => r + c.weight, 0) > 0 ? o : o.map((r) => ({ ...r, weight: 1 }));
}
function ut(s, e, t, n, i, o) {
  const a = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`);
  if (Number.isNaN(a.getTime()) || a > n) return [];
  const r = lt(s, a, n, i), c = new Map((o ?? []).map((h) => [h.date, h])), u = (h, _) => {
    const g = r.map(
      ({ date: w }) => Math.max(0, c.get(E(w))?.[_] ?? 0)
    ), b = g.reduce((w, v) => w + v, 0), f = r.reduce(
      (w, v, S) => w + (g[S] > 0 ? 0 : v.weight),
      0
    ), m = r.map((w, v) => b > 0 && g[v] > 0 ? g[v] : f > 0 ? h * w.weight / f : 0), A = m.reduce((w, v) => w + v, 0);
    return A > 0 ? m.map((w) => w * h / A) : m;
  }, d = u(Math.max(0, e), "selfConsumption"), l = u(Math.max(0, t), "exported");
  return r.map((h, _) => ({
    date: E(h.date),
    selfConsumption: d[_],
    exported: l[_]
  }));
}
function ht(s, e, t, n) {
  const i = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`), o = s.annual_discount_rate ?? 0;
  let a = 0, r = 0, c = 0, u;
  for (const b of t) {
    const f = /* @__PURE__ */ new Date(`${b.date}T00:00:00`), m = b.selfConsumption * s.electricity_price * Y(f, i, o), A = b.exported * s.feed_in_tariff * Y(f, i, o);
    a += m, r += A, c += m + A, !u && c >= s.investment_cost && (u = f);
  }
  if (u) return { ownValue: a, exportValue: r, paybackDate: u };
  const d = s.use_location_seasonality && q(n?.latitude, n?.longitude), l = t.reduce(
    (b, f) => b + (d ? T(/* @__PURE__ */ new Date(`${f.date}T00:00:00`), n.latitude) : 1),
    0
  ), h = t.reduce(
    (b, f) => b + f.selfConsumption * s.electricity_price + f.exported * s.feed_in_tariff,
    0
  );
  if (l <= 0 || h <= 0) return { ownValue: a, exportValue: r };
  const _ = h / l, g = x(e);
  for (let b = 0; b < Qe; b += 1) {
    g.setDate(g.getDate() + 1);
    const f = d ? T(g, n.latitude) : 1;
    if (c += _ * f * Y(g, i, o), c >= s.investment_cost)
      return { ownValue: a, exportValue: r, paybackDate: new Date(g) };
  }
  return { ownValue: a, exportValue: r };
}
function I(s, e, t, n = /* @__PURE__ */ new Date(), i, o) {
  const a = Math.max(0, t - (s.export_energy_baseline ?? 0)), r = s.self_consumption_entity ? Math.max(0, e - (s.self_consumption_baseline ?? 0)) : Math.max(
    0,
    e - (s.production_energy_baseline ?? 0) - a
  ), c = r * s.electricity_price, u = a * s.feed_in_tariff;
  if (ne(s) && (s.annual_discount_rate ?? 0) > 0) {
    const w = ut(
      s,
      r,
      a,
      n,
      i,
      o
    ), v = ht(s, n, w, i), S = v.ownValue + v.exportValue;
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
  const d = c, l = u, h = d + l, _ = Math.min(100, h / s.investment_cost * 100), g = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`), b = at(g, n, h, s.investment_cost), f = i?.latitude, m = i?.longitude, A = s.use_location_seasonality && q(f, m) ? ot(
    s.start_date,
    n,
    h,
    s.investment_cost,
    f
  ) ?? b : b;
  return {
    selfConsumption: r,
    exported: a,
    ownValue: d,
    exportValue: l,
    benefit: h,
    progress: _,
    paybackDate: A
  };
}
function dt(s, e, t, n = /* @__PURE__ */ new Date(), i, o, a = s.annual_discount_rate ?? 3) {
  const r = {
    ...s,
    apply_annual_discount: !1,
    use_historical_statistics: !1
  };
  return {
    linear: I(
      { ...r, use_location_seasonality: !1, annual_discount_rate: 0 },
      e,
      t,
      n,
      i,
      o
    ),
    seasonal: I(
      { ...r, use_location_seasonality: !0, annual_discount_rate: 0 },
      e,
      t,
      n,
      i,
      o
    ),
    discounted: I(
      {
        ...r,
        use_location_seasonality: !0,
        annual_discount_rate: a,
        apply_annual_discount: !0
      },
      e,
      t,
      n,
      i,
      o
    )
  };
}
function be(s, e) {
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
function pt(s) {
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
function _t(s, e) {
  try {
    return pt(s.getItem(e));
  } catch {
    return;
  }
}
function gt(s, e) {
  return s !== void 0 && s >= 0 ? e && s < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: s, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function mt(s) {
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
class yt extends P {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  constructor() {
    super(), this._config = {};
  }
  setConfig(e) {
    this._config = { ...e };
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
    ].includes(t.name), i = t.type === "checkbox" ? t.checked : n ? Number(t.value) : t.value;
    this._config = { ...this._config, [t.name]: i }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityChanged(e, t) {
    const n = t.detail?.value;
    typeof n == "string" && (this._config = { ...this._config, [e]: n }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    ));
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
    const e = tt[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
      ["start_date", e.start_date, "date"],
      ["investment_cost", e.investment_cost, "number"],
      ["electricity_price", e.electricity_price, "number"],
      ["feed_in_tariff", e.feed_in_tariff, "number"]
    ], i = [
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
    )}${this.entityField("self_consumption_entity", e.self_consumption_entity)}${this.entityField("production_energy_entity", e.production_energy_entity)}${this.entityField("export_energy_entity", e.export_energy_entity)}${i.map(
      o
    )}${[
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
  static styles = $e`
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
customElements.define("pv-payback-card-editor", yt);
class ft extends P {
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
    const t = Date.now(), n = e.filter(
      (r) => r.cached && r.issueKey !== void 0
    ), i = new Set(n.map((r) => r.issueKey));
    for (const r of this._warningStartedAt.keys())
      i.has(r) || this._warningStartedAt.delete(r);
    for (const r of n)
      this._warningStartedAt.has(r.issueKey) || this._warningStartedAt.set(r.issueKey, t);
    const o = n.filter(
      (r) => t - this._warningStartedAt.get(r.issueKey) >= me
    ), a = n.map((r) => me - (t - this._warningStartedAt.get(r.issueKey))).filter((r) => r > 0);
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
    const n = De(e, E(t));
    this._historicalStatisticsKey !== n && (this._historicalStatisticsKey = n, ct(this.hass, e)?.then((i) => {
      i && this._historicalStatisticsKey === n && (this._historicalStatistics = i, this.requestUpdate());
    }));
  }
  getCardSize() {
    return 4;
  }
  readEnergy(e, t, n) {
    const i = this.hass?.states[t], o = i ? Number(i.state) : Number.NaN, a = st(o, i?.attributes?.unit_of_measurement), r = _t(localStorage, be(e, t)), c = gt(a, r);
    if (c.value !== void 0) {
      if (!c.cached) {
        const d = JSON.stringify({
          value: c.value,
          timestamp: i?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(be(e, t), d);
        } catch {
        }
      }
      return {
        value: c.value,
        cached: c.cached,
        timestamp: c.cached ? r?.timestamp : i?.last_updated,
        warning: c.regression ? `${t}: ${n.counterRegression}` : void 0,
        issueKey: c.cached ? `${t}:${c.regression ? "regression" : "unavailable"}` : void 0
      };
    }
    const u = i?.attributes?.unit_of_measurement;
    return {
      cached: !1,
      warning: i && !Ee(u) ? `${t}: ${n.unsupportedUnit}` : `${t}: ${n.entityUnavailable}`
    };
  }
  text() {
    return et[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
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
    const n = this.text(), i = [
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
    ];
    return y`<ha-dialog
      .open=${this._scenarioDialogOpen}
      .heading=${n.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${t ? p : y`<p class="scenario-note">${n.locationFallback}</p>`}
        ${i.map(
      ({ name: o, scenario: a, icon: r, className: c }, u) => y`<section class=${`scenario ${c}`}>
              <div class="scenario-heading">
                <ha-icon .icon=${r}></ha-icon>
                <h3>${o}</h3>
              </div>
              ${u === 2 ? y`<div class="scenario-rate">
                      ${n.discountRate}: ${this.formatPercentage(this._comparisonDiscountRate)}
                      ${this._comparisonUsesDefaultRate ? y`(${n.defaultRate})` : p}
                    </div>` : p}
              <div class="scenario-values">
                <div>
                  <span>${n.benefit}</span><strong>${this.formatMoney(a.benefit)}</strong>
                </div>
                <div>
                  <span>${n.expected}</span
                  ><strong>${this.formatDate(a.paybackDate)}</strong>
                </div>
              </div>
            </section>`
    )}
      </div>
      <ha-button slot="primaryAction" @click=${this.closeScenarioDialog}>${n.close}</ha-button>
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
    if (!e) return p;
    const t = this.text(), n = mt(e);
    if (n)
      return y`<ha-card
        ><div class="content error" role="alert">${t.invalid}: ${n}</div></ha-card
      >`;
    const i = e.self_consumption_entity ? this.readEnergy(e, e.self_consumption_entity, t) : void 0, o = !i && e.production_energy_entity ? this.readEnergy(e, e.production_energy_entity, t) : void 0, a = this.readEnergy(e, e.export_energy_entity, t), r = [i, o, a].filter(
      ($) => !!$
    ), c = this.persistentWarningReadings(r), u = i?.value, d = o?.value, l = a.value;
    if (l === void 0 || i !== void 0 && u === void 0 || o !== void 0 && d === void 0)
      return y`<ha-card
        ><div class="content error" role="alert">
          ${t.unavailable}${r.map(
        ($) => $.warning ? y`<br />${$.warning}` : p
      )}
        </div></ha-card
      >`;
    const h = u ?? d, _ = /* @__PURE__ */ new Date(), g = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude
    }, b = this._historicalStatistics ? `loaded:${this._historicalStatisticsKey ?? ""}` : `approximation:${this._historicalStatisticsKey ?? ""}`, f = JSON.stringify([
      e,
      h,
      l,
      E(_),
      g,
      b
    ]);
    this._calculationCache?.key !== f && (this._calculationCache = {
      key: f,
      calculation: I(
        e,
        h,
        l,
        _,
        g,
        fe(e, this._historicalStatistics)
      )
    });
    const m = this._calculationCache.calculation;
    let A;
    if (this._scenarioDialogOpen) {
      const $ = `${f}:${this._comparisonDiscountRate}`;
      this._scenarioCalculationCache?.key !== $ && (this._scenarioCalculationCache = {
        key: $,
        scenarios: dt(
          e,
          h,
          l,
          _,
          g,
          fe(e, this._historicalStatistics),
          this._comparisonDiscountRate
        )
      }), A = this._scenarioCalculationCache.scenarios;
    }
    const w = c.length > 0, v = c.map(($) => $.timestamp).filter(Boolean).sort().at(0), S = w ? `${t.cached}${v ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(v))}` : ""}${c.filter(($) => $.warning).map(($) => ` ${$.warning}`).join("")}` : void 0, ie = Math.min(
      100,
      Math.max(0, m.ownValue / e.investment_cost * 100)
    ), Ce = Math.min(
      Math.max(0, 100 - ie),
      Math.max(0, m.exportValue / e.investment_cost * 100)
    );
    return y`<ha-card>
        <div class="content">
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${it(e.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${S ? y`<span
                      class="warning-indicator"
                      role="img"
                      aria-label=${S}
                      title=${S}
                      ><ha-icon icon="mdi:alert"></ha-icon
                    ></span>` : p}
              ${e.show_progress ? y`<span class="header-progress">${m.progress.toFixed(1)}%</span>` : p}
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
          ${e.show_progress ? y`<div
                  class="bar ${e.show_contribution_segments ? "contribution-segments" : ""}"
                  role="progressbar"
                  aria-label=${t.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow=${m.progress}
                >
                  ${e.show_contribution_segments ? y`<div
                            class="contribution-own"
                            style=${`width:${ie}%`}
                          ></div>
                          <div
                            class="contribution-export"
                            style=${`width:${Ce}%`}
                          ></div>` : y`<div style=${`width:${m.progress}%`}></div>`}
                </div>` : p}
          ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? y`<div
                  class="breakdown ${e.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <div
                    class="own"
                    role=${e.self_consumption_entity ? "button" : p}
                    tabindex=${e.self_consumption_entity ? "0" : p}
                    aria-label=${e.self_consumption_entity ? t.own : p}
                    @click=${e.self_consumption_entity ? () => this.openMoreInfo(e.self_consumption_entity) : p}
                    @keydown=${e.self_consumption_entity ? ($) => this.handleBreakdownKeydown($, e.self_consumption_entity) : p}
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
                    @keydown=${($) => this.handleBreakdownKeydown($, e.export_energy_entity)}
                  >
                    <span>${t.export}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(m.exported)} · ${this.formatMoney(m.exportValue)}` : e.show_energy_values ? this.formatEnergy(m.exported) : this.formatMoney(m.exportValue)}</b
                    >
                  </div>
                </div>` : p}
          ${e.show_payback_date ? y`<div class="date">
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
                </div>` : p}
        </div>
      </ha-card>
      ${this._scenarioDialogOpen && A ? this.renderScenarioDialog(
      A,
      q(g.latitude, g.longitude)
    ) : p}`;
  }
  static styles = $e`
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
customElements.define("pv-payback-card", ft);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  ft as PVPaybackCard,
  yt as PVPaybackCardEditor,
  ne as appliesAnnualDiscount,
  be as cacheKey,
  I as calculatePayback,
  dt as calculateScenarioComparisons,
  ot as calculateSeasonalPaybackDate,
  gt as chooseEnergyValue,
  fe as dailyEnergyFromStatistics,
  it as displayName,
  ut as distributeHistoricalEnergy,
  st as energyToKwh,
  De as historicalStatisticsCacheKey,
  ct as loadHistoricalStatistics,
  pt as parseCachedEnergy,
  _t as readCachedEnergy,
  Z as statisticDailyDeltas,
  nt as withDisplayDefaults
};
