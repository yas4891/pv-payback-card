const K = globalThis, te = K.ShadowRoot && (K.ShadyCSS === void 0 || K.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ne = /* @__PURE__ */ Symbol(), le = /* @__PURE__ */ new WeakMap();
let Se = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== ne) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (te && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = le.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && le.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Re = (n) => new Se(typeof n == "string" ? n : n + "", void 0, ne), ke = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((i, s, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[a + 1], n[0]);
  return new Se(t, n, ne);
}, Ue = (n, e) => {
  if (te) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = K.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, n.appendChild(i);
  }
}, de = te ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return Re(t);
})(n) : n;
const { is: ze, defineProperty: Fe, getOwnPropertyDescriptor: Ve, getOwnPropertyNames: He, getOwnPropertySymbols: je, getPrototypeOf: Ke } = Object, q = globalThis, ue = q.trustedTypes, Ie = ue ? ue.emptyScript : "", Be = q.reactiveElementPolyfillSupport, z = (n, e) => n, ee = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? Ie : null;
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
} }, Ee = (n, e) => !ze(n, e), he = { attribute: !0, type: String, converter: ee, reflect: !1, useDefault: !1, hasChanged: Ee };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), q.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = he) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && Fe(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: a } = Ve(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? he;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = Ke(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, i = [...He(t), ...je(t)];
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
      for (const s of i) t.unshift(de(s));
    } else e !== void 0 && t.push(de(e));
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
    return Ue(e, this.constructor.elementStyles), e;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : ee).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : ee;
      this._$Em = s;
      const r = o.fromAttribute(t, a.type);
      this[s] = r ?? this._$Ej?.get(s) ?? r, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, s = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (a = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? Ee)(a, t) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
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
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[z("elementProperties")] = /* @__PURE__ */ new Map(), N[z("finalized")] = /* @__PURE__ */ new Map(), Be?.({ ReactiveElement: N }), (q.reactiveElementVersions ??= []).push("2.1.2");
const ie = globalThis, pe = (n) => n, L = ie.trustedTypes, _e = L ? L.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, De = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, Ce = "?" + S, Le = `<${Ce}>`, M = document, F = () => M.createComment(""), V = (n) => n === null || typeof n != "object" && typeof n != "function", se = Array.isArray, qe = (n) => se(n) || typeof n?.[Symbol.iterator] == "function", G = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, me = />/g, D = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ye = /'/g, fe = /"/g, Me = /^(?:script|style|textarea|title)$/i, Je = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), f = Je(1), W = /* @__PURE__ */ Symbol.for("lit-noChange"), u = /* @__PURE__ */ Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), C = M.createTreeWalker(M, 129);
function Ne(n, e) {
  if (!se(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _e !== void 0 ? _e.createHTML(e) : e;
}
const Ye = (n, e) => {
  const t = n.length - 1, i = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = U;
  for (let r = 0; r < t; r++) {
    const c = n[r];
    let d, h, l = -1, p = 0;
    for (; p < c.length && (o.lastIndex = p, h = o.exec(c), h !== null); ) p = o.lastIndex, o === U ? h[1] === "!--" ? o = ge : h[1] !== void 0 ? o = me : h[2] !== void 0 ? (Me.test(h[2]) && (s = RegExp("</" + h[2], "g")), o = D) : h[3] !== void 0 && (o = D) : o === D ? h[0] === ">" ? (o = s ?? U, l = -1) : h[1] === void 0 ? l = -2 : (l = o.lastIndex - h[2].length, d = h[1], o = h[3] === void 0 ? D : h[3] === '"' ? fe : ye) : o === fe || o === ye ? o = D : o === ge || o === me ? o = U : (o = D, s = void 0);
    const _ = o === D && n[r + 1].startsWith("/>") ? " " : "";
    a += o === U ? c + Le : l >= 0 ? (i.push(d), c.slice(0, l) + De + c.slice(l) + S + _) : c + S + (l === -2 ? r : _);
  }
  return [Ne(n, a + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let a = 0, o = 0;
    const r = e.length - 1, c = this.parts, [d, h] = Ye(e, t);
    if (this.el = H.createElement(d, i), C.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = C.nextNode()) !== null && c.length < r; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(De)) {
          const p = h[o++], _ = s.getAttribute(l).split(S), g = /([.?@])?(.*)/.exec(p);
          c.push({ type: 1, index: a, name: g[2], strings: _, ctor: g[1] === "." ? Ge : g[1] === "?" ? Xe : g[1] === "@" ? Qe : J }), s.removeAttribute(l);
        } else l.startsWith(S) && (c.push({ type: 6, index: a }), s.removeAttribute(l));
        if (Me.test(s.tagName)) {
          const l = s.textContent.split(S), p = l.length - 1;
          if (p > 0) {
            s.textContent = L ? L.emptyScript : "";
            for (let _ = 0; _ < p; _++) s.append(l[_], F()), C.nextNode(), c.push({ type: 2, index: ++a });
            s.append(l[p], F());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ce) c.push({ type: 2, index: a });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(S, l + 1)) !== -1; ) c.push({ type: 7, index: a }), l += S.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const i = M.createElement("template");
    return i.innerHTML = e, i;
  }
}
function O(n, e, t = n, i) {
  if (e === W) return e;
  let s = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const a = V(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(n), s._$AT(n, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = s : t._$Cl = s), s !== void 0 && (e = O(n, s._$AS(n, e.values), s, i)), e;
}
class Ze {
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
    const { el: { content: t }, parts: i } = this._$AD, s = (e?.creationScope ?? M).importNode(t, !0);
    C.currentNode = s;
    let a = C.nextNode(), o = 0, r = 0, c = i[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let d;
        c.type === 2 ? d = new j(a, a.nextSibling, this, e) : c.type === 1 ? d = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (d = new et(a, this, e)), this._$AV.push(d), c = i[++r];
      }
      o !== c?.index && (a = C.nextNode(), o++);
    }
    return C.currentNode = M, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class j {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = O(this, e, t), V(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== W && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : qe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && V(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = H.createElement(Ne(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const a = new Ze(s, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = be.get(e.strings);
    return t === void 0 && be.set(e.strings, t = new H(e)), t;
  }
  k(e) {
    se(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const a of e) s === t.length ? t.push(i = new j(this.O(F()), this.O(F()), this, this.options)) : i = t[s], i._$AI(a), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = pe(e).nextSibling;
      pe(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, a) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  _$AI(e, t = this, i, s) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = O(this, e, t, 0), o = !V(e) || e !== this._$AH && e !== W, o && (this._$AH = e);
    else {
      const r = e;
      let c, d;
      for (e = a[0], c = 0; c < a.length - 1; c++) d = O(this, r[i + c], t, c), d === W && (d = this._$AH[c]), o ||= !V(d) || d !== this._$AH[c], d === u ? e = u : e !== u && (e += (d ?? "") + a[c + 1]), this._$AH[c] = d;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ge extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class Xe extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class Qe extends J {
  constructor(e, t, i, s, a) {
    super(e, t, i, s, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = O(this, e, t, 0) ?? u) === W) return;
    const i = this._$AH, s = e === u && i !== u || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== u && (i === u || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class et {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    O(this, e);
  }
}
const tt = ie.litHtmlPolyfillSupport;
tt?.(H, j), (ie.litHtmlVersions ??= []).push("3.3.3");
const nt = (n, e, t) => {
  const i = t?.renderBefore ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = t?.renderBefore ?? null;
    i._$litPart$ = s = new j(e.insertBefore(F(), a), a, void 0, t ?? {});
  }
  return s._$AI(n), s;
};
const ae = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = nt(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return W;
  }
}
P._$litElement$ = !0, P.finalized = !0, ae.litElementHydrateSupport?.({ LitElement: P });
const it = ae.litElementPolyfillSupport;
it?.({ LitElement: P });
(ae.litElementVersions ??= []).push("4.2.2");
const st = 365.2425, at = 366 * 50, ve = 180 * 1e3, $e = /* @__PURE__ */ new Map(), ot = {
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
}, rt = {
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
function I(n) {
  return n === "Wh" || n === "kWh" || n === "MWh";
}
function ct(n, e) {
  if (!(!Number.isFinite(n) || !I(e)))
    return e === "Wh" ? n / 1e3 : e === "MWh" ? n * 1e3 : n;
}
function lt(n) {
  return {
    ...n,
    display_style: n.display_style ?? "full",
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
function oe(n) {
  return n.apply_annual_discount ?? n.use_historical_statistics ?? !1;
}
function we(n, e) {
  return !n || n === "PV-Amortisation" ? e : n;
}
function dt(n, e, t, i) {
  if (t <= 0 || n > e) return;
  const s = Math.max(1, (e.getTime() - n.getTime()) / 864e5);
  return new Date(n.getTime() + i / t * s * 864e5);
}
function x(n) {
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
function T(n, e) {
  const t = new Date(n.getFullYear(), 0, 0), i = Math.round((x(n).getTime() - t.getTime()) / 864e5), s = e * Math.PI / 180, a = 0.409 * Math.sin(2 * Math.PI * i / 365 - 1.39), o = -Math.tan(s) * Math.tan(a), r = Math.acos(Math.max(-1, Math.min(1, o))), c = r * Math.sin(s) * Math.sin(a) + Math.cos(s) * Math.cos(a) * Math.sin(r);
  return Math.max(0, c);
}
function ut(n, e, t, i, s) {
  const a = /* @__PURE__ */ new Date(`${n}T00:00:00`);
  if (Number.isNaN(a.getTime()) || !Number.isFinite(e.getTime()) || !Number.isFinite(t) || t <= 0 || !Number.isFinite(i) || i <= 0 || !Number.isFinite(s) || s < -90 || s > 90 || a > e)
    return;
  const o = x(e);
  let r = 0;
  for (let _ = x(a); _ <= o; _.setDate(_.getDate() + 1))
    r += T(_, s);
  if (!Number.isFinite(r) || r <= 0) return;
  const c = t / r, d = Math.max(1e-9, i * Number.EPSILON * 16);
  if (t >= i) {
    let _ = 0;
    for (let g = x(a); g <= o; g.setDate(g.getDate() + 1))
      if (_ += T(g, s) * c, _ >= i - d) return new Date(g);
    return;
  }
  let h = t;
  const l = new Date(o), p = 366 * 50;
  for (let _ = 0; _ < p; _ += 1) {
    if (h >= i - d) return new Date(l);
    l.setDate(l.getDate() + 1), h += T(l, s) * c;
  }
}
function Y(n, e) {
  return typeof n == "number" && Number.isFinite(n) && n >= -90 && n <= 90 && typeof e == "number" && Number.isFinite(e) && e >= -180 && e <= 180;
}
function k(n) {
  return [
    n.getFullYear(),
    String(n.getMonth() + 1).padStart(2, "0"),
    String(n.getDate()).padStart(2, "0")
  ].join("-");
}
function X(n, e, t) {
  const i = Math.max(
    0,
    (x(n).getTime() - x(e).getTime()) / 864e5
  );
  return 1 / (1 + t / 100) ** (i / st);
}
function ht(n) {
  const e = n.start ?? n.start_time;
  if (typeof e == "number")
    return !Number.isFinite(e) || Number.isNaN(new Date(e).getTime()) ? void 0 : k(new Date(e));
  if (!(typeof e != "string" || Number.isNaN(new Date(e).getTime())))
    return e.slice(0, 10);
}
function Q(n) {
  const e = /* @__PURE__ */ new Map();
  let t;
  for (const i of n ?? []) {
    const s = ht(i), a = typeof i.sum == "number" ? i.sum : Number.NaN;
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
function xe(n, e) {
  const t = Q(e?.[n.export_energy_entity]), i = n.self_consumption_entity ? Q(e?.[n.self_consumption_entity]) : void 0, s = n.production_energy_entity ? Q(e?.[n.production_energy_entity]) : void 0;
  return [.../* @__PURE__ */ new Set([
    ...t.keys(),
    ...i?.keys() ?? [],
    ...s?.keys() ?? []
  ])].sort().flatMap((o) => {
    const r = t.get(o);
    if (r === void 0) return [];
    const c = i ? i.get(o) : s?.get(o) === void 0 ? void 0 : Math.max(0, s.get(o) - r);
    return c === void 0 || !Number.isFinite(c) || c < 0 ? [] : [{ date: o, selfConsumption: c, exported: r }];
  });
}
function Pe(n, e) {
  const t = n.self_consumption_entity ? ["direct", n.self_consumption_entity, n.export_energy_entity] : ["derived", n.production_energy_entity, n.export_energy_entity];
  return JSON.stringify([t, n.start_date, e]);
}
function pt(n, e, t = /* @__PURE__ */ new Date()) {
  if (!n.callWS || !oe(e) || (e.annual_discount_rate ?? 0) <= 0)
    return;
  const i = /* @__PURE__ */ new Date(`${e.start_date}T00:00:00`);
  if (Number.isNaN(i.getTime()) || Number.isNaN(t.getTime())) return;
  const s = x(i);
  s.setDate(s.getDate() - 1);
  const a = x(t), o = x(t);
  o.setDate(o.getDate() - 1);
  const r = k(o), c = Pe(e, r), d = $e.get(c);
  if (d) return d;
  const h = e.self_consumption_entity ? [e.self_consumption_entity, e.export_energy_entity] : [e.production_energy_entity, e.export_energy_entity], l = n.callWS({
    type: "recorder/statistics_during_period",
    start_time: `${k(s)}T00:00:00`,
    end_time: `${k(a)}T00:00:00`,
    statistic_ids: h,
    period: "day",
    types: ["sum"]
  }).then(
    (p) => p && typeof p == "object" ? p : void 0
  ).catch(() => {
  });
  return $e.set(c, l), l;
}
function _t(n, e, t, i) {
  const s = n.use_location_seasonality && Y(i?.latitude, i?.longitude), a = [];
  for (let r = x(e); r <= x(t); r.setDate(r.getDate() + 1))
    a.push({
      date: new Date(r),
      weight: s ? T(r, i.latitude) : 1
    });
  return a.reduce((r, c) => r + c.weight, 0) > 0 ? a : a.map((r) => ({ ...r, weight: 1 }));
}
function gt(n, e, t, i, s, a) {
  const o = /* @__PURE__ */ new Date(`${n.start_date}T00:00:00`);
  if (Number.isNaN(o.getTime()) || o > i) return [];
  const r = _t(n, o, i, s), c = new Map((a ?? []).map((p) => [p.date, p])), d = (p, _) => {
    const g = r.map(
      ({ date: w }) => Math.max(0, c.get(k(w))?.[_] ?? 0)
    ), $ = g.reduce((w, v) => w + v, 0), b = r.reduce(
      (w, v, E) => w + (g[E] > 0 ? 0 : v.weight),
      0
    ), m = r.map((w, v) => $ > 0 && g[v] > 0 ? g[v] : b > 0 ? p * w.weight / b : 0), A = m.reduce((w, v) => w + v, 0);
    return A > 0 ? m.map((w) => w * p / A) : m;
  }, h = d(Math.max(0, e), "selfConsumption"), l = d(Math.max(0, t), "exported");
  return r.map((p, _) => ({
    date: k(p.date),
    selfConsumption: h[_],
    exported: l[_]
  }));
}
function mt(n, e, t, i) {
  const s = /* @__PURE__ */ new Date(`${n.start_date}T00:00:00`), a = n.annual_discount_rate ?? 0;
  let o = 0, r = 0, c = 0, d;
  for (const $ of t) {
    const b = /* @__PURE__ */ new Date(`${$.date}T00:00:00`), m = $.selfConsumption * n.electricity_price * X(b, s, a), A = $.exported * n.feed_in_tariff * X(b, s, a);
    o += m, r += A, c += m + A, !d && c >= n.investment_cost && (d = b);
  }
  if (d) return { ownValue: o, exportValue: r, paybackDate: d };
  const h = n.use_location_seasonality && Y(i?.latitude, i?.longitude), l = t.reduce(
    ($, b) => $ + (h ? T(/* @__PURE__ */ new Date(`${b.date}T00:00:00`), i.latitude) : 1),
    0
  ), p = t.reduce(
    ($, b) => $ + b.selfConsumption * n.electricity_price + b.exported * n.feed_in_tariff,
    0
  );
  if (l <= 0 || p <= 0) return { ownValue: o, exportValue: r };
  const _ = p / l, g = x(e);
  for (let $ = 0; $ < at; $ += 1) {
    g.setDate(g.getDate() + 1);
    const b = h ? T(g, i.latitude) : 1;
    if (c += _ * b * X(g, s, a), c >= n.investment_cost)
      return { ownValue: o, exportValue: r, paybackDate: new Date(g) };
  }
  return { ownValue: o, exportValue: r };
}
function B(n, e, t, i = /* @__PURE__ */ new Date(), s, a) {
  const o = Math.max(0, t - (n.export_energy_baseline ?? 0)), r = n.self_consumption_entity ? Math.max(0, e - (n.self_consumption_baseline ?? 0)) : Math.max(
    0,
    e - (n.production_energy_baseline ?? 0) - o
  ), c = r * n.electricity_price, d = o * n.feed_in_tariff;
  if (oe(n) && (n.annual_discount_rate ?? 0) > 0) {
    const w = gt(
      n,
      r,
      o,
      i,
      s,
      a
    ), v = mt(n, i, w, s), E = v.ownValue + v.exportValue;
    return {
      selfConsumption: r,
      exported: o,
      ownValue: v.ownValue,
      exportValue: v.exportValue,
      benefit: E,
      progress: Math.min(100, E / n.investment_cost * 100),
      paybackDate: v.paybackDate
    };
  }
  const h = c, l = d, p = h + l, _ = Math.min(100, p / n.investment_cost * 100), g = /* @__PURE__ */ new Date(`${n.start_date}T00:00:00`), $ = dt(g, i, p, n.investment_cost), b = s?.latitude, m = s?.longitude, A = n.use_location_seasonality && Y(b, m) ? ut(
    n.start_date,
    i,
    p,
    n.investment_cost,
    b
  ) ?? $ : $;
  return {
    selfConsumption: r,
    exported: o,
    ownValue: h,
    exportValue: l,
    benefit: p,
    progress: _,
    paybackDate: A
  };
}
function yt(n, e, t, i = /* @__PURE__ */ new Date(), s, a, o = n.annual_discount_rate ?? 3) {
  const r = {
    ...n,
    apply_annual_discount: !1,
    use_historical_statistics: !1
  };
  return {
    linear: B(
      { ...r, use_location_seasonality: !1, annual_discount_rate: 0 },
      e,
      t,
      i,
      s,
      a
    ),
    seasonal: B(
      { ...r, use_location_seasonality: !0, annual_discount_rate: 0 },
      e,
      t,
      i,
      s,
      a
    ),
    discounted: B(
      {
        ...r,
        use_location_seasonality: !0,
        annual_discount_rate: o,
        apply_annual_discount: !0
      },
      e,
      t,
      i,
      s,
      a
    )
  };
}
function Ae(n, e) {
  const t = !!n.self_consumption_entity;
  return `pv-payback-card:last-valid:${JSON.stringify([
    t ? "direct-self-consumption" : "derived-self-consumption",
    t ? n.self_consumption_entity : n.production_energy_entity,
    n.export_energy_entity,
    n.start_date,
    n.self_consumption_baseline ?? 0,
    n.production_energy_baseline ?? 0,
    n.export_energy_baseline ?? 0
  ])}:${e}`;
}
function ft(n) {
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
function bt(n, e) {
  try {
    return ft(n.getItem(e));
  } catch {
    return;
  }
}
function vt(n, e) {
  return n !== void 0 && n >= 0 ? e && n < e.value ? { value: e.value, cached: !0, regression: !0 } : { value: n, cached: !1, regression: !1 } : e ? { value: e.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function $t(n) {
  if (n.display_style !== void 0 && !["full", "compact"].includes(n.display_style))
    return "display_style";
  if (!n.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${n.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const e of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(n[e]) || n[e] < 0) return e;
  if (n.investment_cost <= 0) return "investment_cost";
  for (const e of [
    "self_consumption_baseline",
    "production_energy_baseline",
    "export_energy_baseline"
  ]) {
    const t = n[e];
    if (t !== void 0 && !Number.isFinite(t)) return e;
  }
  if (!Number.isFinite(n.annual_discount_rate ?? 0) || (n.annual_discount_rate ?? 0) < 0)
    return "annual_discount_rate";
  if (!n.export_energy_entity || !n.self_consumption_entity && !n.production_energy_entity)
    return "energy entity";
}
class wt extends P {
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
    const t = e.target, i = [
      "investment_cost",
      "electricity_price",
      "feed_in_tariff",
      "self_consumption_baseline",
      "production_energy_baseline",
      "export_energy_baseline",
      "annual_discount_rate"
    ].includes(t.name), s = t.type === "checkbox" ? t.checked : i ? Number(t.value) : t.value;
    this._config = { ...this._config, [t.name]: s }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityChanged(e, t) {
    const i = t.detail?.value, s = typeof i == "string" ? i.trim() : "", a = { ...this._config };
    s ? a[e] = s : delete a[e], this._config = a, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
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
    const e = rt[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], t = [
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
    ], a = ([r, c, d]) => f`<label
        >${c}<input
          name=${r}
          type=${d}
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
            </section>` : u}`;
  }
  static styles = ke`
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
customElements.define("pv-payback-card-editor", wt);
class xt extends P {
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
    this._comparisonDiscountRate = e.annual_discount_rate ?? 3, this._comparisonUsesDefaultRate = e.annual_discount_rate === void 0, this._config = lt(e), this._historicalStatistics = void 0, this._historicalStatisticsKey = void 0, this._calculationCache = void 0, this._scenarioCalculationCache = void 0, this.resetWarningDelay();
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
      (r) => r.issueKey !== void 0
    ), s = new Set(i.map((r) => r.issueKey));
    for (const r of this._warningStartedAt.keys())
      s.has(r) || this._warningStartedAt.delete(r);
    for (const r of i)
      this._warningStartedAt.has(r.issueKey) || this._warningStartedAt.set(r.issueKey, t);
    const a = i.filter(
      (r) => t - this._warningStartedAt.get(r.issueKey) >= ve
    ), o = i.map((r) => ve - (t - this._warningStartedAt.get(r.issueKey))).filter((r) => r > 0);
    return this._warningTimer !== void 0 && clearTimeout(this._warningTimer), this._warningTimer = void 0, o.length > 0 && (this._warningTimer = setTimeout(
      () => {
        this._warningTimer = void 0, this.requestUpdate();
      },
      Math.min(...o)
    )), a;
  }
  updated() {
    const e = this._config;
    if (!e || !this.hass?.callWS || !oe(e) || (e.annual_discount_rate ?? 0) <= 0)
      return;
    const t = x(/* @__PURE__ */ new Date());
    t.setDate(t.getDate() - 1);
    const i = Pe(e, k(t));
    this._historicalStatisticsKey !== i && (this._historicalStatisticsKey = i, pt(this.hass, e)?.then((s) => {
      s && this._historicalStatisticsKey === i && (this._historicalStatistics = s, this.requestUpdate());
    }));
  }
  getCardSize() {
    return 4;
  }
  readEnergy(e, t, i) {
    const s = this.hass?.states[t], a = s ? Number(s.state) : Number.NaN, o = ct(a, s?.attributes?.unit_of_measurement), r = bt(localStorage, Ae(e, t)), c = vt(o, r), d = s?.attributes?.unit_of_measurement, h = s && !I(d) ? i.unsupportedUnit : i.entityUnavailable;
    if (c.value !== void 0) {
      if (!c.cached) {
        const l = JSON.stringify({
          value: c.value,
          timestamp: s?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(Ae(e, t), l);
        } catch {
        }
      }
      return {
        value: c.value,
        cached: c.cached,
        timestamp: c.cached ? r?.timestamp : s?.last_updated,
        warning: c.regression ? `${t}: ${i.counterRegression}` : c.cached ? `${t}: ${h}` : void 0,
        issueKey: c.cached ? `${t}:${c.regression ? "regression" : "unavailable"}` : void 0
      };
    }
    return {
      cached: !1,
      issueKey: `${t}:${s && !I(d) ? "unsupported-unit" : "unavailable"}`,
      warning: s && !I(d) ? `${t}: ${i.unsupportedUnit}` : `${t}: ${i.entityUnavailable}`
    };
  }
  text() {
    return ot[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
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
    const i = this.text(), s = [
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
    ], a = [
      t ? void 0 : i.locationFallback,
      s.some(({ scenario: o }) => !o.paybackDate) ? i.noProjection : void 0
    ].filter((o) => o !== void 0);
    return f`<ha-dialog
      .open=${this._scenarioDialogOpen}
      .heading=${i.scenariosTitle}
      @closed=${this.closeScenarioDialog}
    >
      <div class="scenario-dialog">
        ${a.length > 0 ? f`<div class="scenario-warning">
                ${this.renderWarningIndicator(a.join(`
`))}
              </div>` : u}
        ${s.map(
      ({ name: o, scenario: r, icon: c, className: d }, h) => f`<section class=${`scenario ${d}`}>
              <div class="scenario-heading">
                <ha-icon .icon=${c}></ha-icon>
                <h3>${o}</h3>
              </div>
              ${h === 2 ? f`<div class="scenario-rate">
                      ${i.discountRate}: ${this.formatPercentage(this._comparisonDiscountRate)}
                      ${this._comparisonUsesDefaultRate ? f`(${i.defaultRate})` : u}
                    </div>` : u}
              <div class="scenario-values">
                <div>
                  <span>${i.benefit}</span><strong>${this.formatMoney(r.benefit)}</strong>
                </div>
                <div>
                  <span>${i.expected}</span
                  ><strong>${this.formatDate(r.paybackDate)}</strong>
                </div>
              </div>
            </section>`
    )}
      </div>
      <ha-button slot="primaryAction" @click=${this.closeScenarioDialog}>${i.close}</ha-button>
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
    if (!this._warningDialogMessage) return u;
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
              ><span>${we(t.name, i.title)}</span>
            </div>
            <div class="header-meta">
              ${e ? this.renderWarningIndicator(e) : u}
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
    if (!e) return u;
    const t = this.text(), i = $t(e);
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
    const s = e.self_consumption_entity ? this.readEnergy(e, e.self_consumption_entity, t) : void 0, a = !s && e.production_energy_entity ? this.readEnergy(e, e.production_energy_entity, t) : void 0, o = this.readEnergy(e, e.export_energy_entity, t), r = [s, a, o].filter(
      (y) => !!y
    );
    let c = this.persistentWarningReadings(r);
    const d = s?.value, h = a?.value, l = o.value;
    if (l === void 0 || s !== void 0 && d === void 0 || a !== void 0 && h === void 0) {
      const y = c.length > 0 ? `${t.unavailable}${c.filter((Z) => Z.warning).map((Z) => ` ${Z.warning}`).join("")}` : void 0;
      return this.renderStatusCard(y);
    }
    const p = d ?? h, _ = /* @__PURE__ */ new Date(), g = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude
    }, $ = this._historicalStatistics ? `loaded:${this._historicalStatisticsKey ?? ""}` : `approximation:${this._historicalStatisticsKey ?? ""}`, b = JSON.stringify([
      e,
      p,
      l,
      k(_),
      g,
      $
    ]);
    this._calculationCache?.key !== b && (this._calculationCache = {
      key: b,
      calculation: B(
        e,
        p,
        l,
        _,
        g,
        xe(e, this._historicalStatistics)
      )
    });
    const m = this._calculationCache.calculation, A = e.show_payback_date && !m.paybackDate ? {
      cached: !1,
      issueKey: "projection:no-positive-benefit",
      warning: t.noProjection
    } : void 0;
    c = this.persistentWarningReadings([
      ...r,
      ...A ? [A] : []
    ]);
    let w;
    if (this._scenarioDialogOpen) {
      const y = `${b}:${this._comparisonDiscountRate}`;
      this._scenarioCalculationCache?.key !== y && (this._scenarioCalculationCache = {
        key: y,
        scenarios: yt(
          e,
          p,
          l,
          _,
          g,
          xe(e, this._historicalStatistics),
          this._comparisonDiscountRate
        )
      }), w = this._scenarioCalculationCache.scenarios;
    }
    const v = c.filter(
      (y) => y.issueKey !== "projection:no-positive-benefit"
    ), E = v.map((y) => y.timestamp).filter(Boolean).sort().at(0), Te = v.length > 0 ? `${t.cached}${E ? `: ${new Intl.DateTimeFormat(e.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(E))}` : ""}${v.filter((y) => y.warning).map((y) => ` ${y.warning}`).join("")}` : void 0, We = c.some(
      (y) => y.issueKey === "projection:no-positive-benefit"
    ) ? t.noProjection : void 0, re = [Te, We].filter((y) => !!y).join(`
`), ce = Math.min(
      100,
      Math.max(0, m.ownValue / e.investment_cost * 100)
    ), Oe = Math.min(
      Math.max(0, 100 - ce),
      Math.max(0, m.exportValue / e.investment_cost * 100)
    ), R = e.display_style === "compact";
    return f`<ha-card>
        <div class=${`content ${R ? "compact" : "full"}`}>
          <div class="header">
            <div class="header-title">
              <ha-icon .icon=${e.icon ?? "mdi:solar-power-variant"}></ha-icon
              ><span>${we(e.name, t.title)}</span>
            </div>
            <div class="header-meta">
              ${re ? this.renderWarningIndicator(re) : u}
              ${e.show_progress ? f`<span class="header-progress">${m.progress.toFixed(1)}%</span>` : u}
            </div>
          </div>
          <div class="benefit" title=${R ? t.benefit : u}>
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
                            style=${`width:${ce}%`}
                          ></div>
                          <div
                            class="contribution-export"
                            style=${`width:${Oe}%`}
                          ></div>` : f`<div style=${`width:${m.progress}%`}></div>`}
                </div>` : u}
          ${e.show_breakdown && (e.show_energy_values || e.show_money_values) ? f`<div
                  class="breakdown ${e.show_contribution_segments ? "contribution-segments" : ""}"
                >
                  <div
                    class="own"
                    role=${e.self_consumption_entity ? "button" : u}
                    tabindex=${e.self_consumption_entity ? "0" : u}
                    aria-label=${t.own}
                    title=${R ? t.own : u}
                    @click=${e.self_consumption_entity ? () => this.openMoreInfo(e.self_consumption_entity) : u}
                    @keydown=${e.self_consumption_entity ? (y) => this.handleBreakdownKeydown(y, e.self_consumption_entity) : u}
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
                    title=${R ? t.export : u}
                    @click=${() => this.openMoreInfo(e.export_energy_entity)}
                    @keydown=${(y) => this.handleBreakdownKeydown(y, e.export_energy_entity)}
                  >
                    <span>${t.export}</span
                    ><b
                      >${e.show_energy_values && e.show_money_values ? `${this.formatEnergy(m.exported)} · ${this.formatMoney(m.exportValue)}` : e.show_energy_values ? this.formatEnergy(m.exported) : this.formatMoney(m.exportValue)}</b
                    >
                  </div>
                </div>` : u}
          ${e.show_payback_date ? f`<div class="date" title=${R ? t.expected : u}>
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
                </div>` : u}
        </div>
      </ha-card>
      ${this._scenarioDialogOpen && w ? this.renderScenarioDialog(
      w,
      Y(g.latitude, g.longitude)
    ) : u}
      ${this.renderWarningDialog()}`;
  }
  static styles = ke`
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
customElements.define("pv-payback-card", xt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  xt as PVPaybackCard,
  wt as PVPaybackCardEditor,
  oe as appliesAnnualDiscount,
  Ae as cacheKey,
  B as calculatePayback,
  yt as calculateScenarioComparisons,
  ut as calculateSeasonalPaybackDate,
  vt as chooseEnergyValue,
  xe as dailyEnergyFromStatistics,
  we as displayName,
  gt as distributeHistoricalEnergy,
  ct as energyToKwh,
  Pe as historicalStatisticsCacheKey,
  pt as loadHistoricalStatistics,
  ft as parseCachedEnergy,
  bt as readCachedEnergy,
  Q as statisticDailyDeltas,
  lt as withDisplayDefaults
};
