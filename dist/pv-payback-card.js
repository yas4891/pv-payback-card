const I = globalThis, Z = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = /* @__PURE__ */ Symbol(), st = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = st.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && st.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const At = (s) => new mt(typeof s == "string" ? s : s + "", void 0, G), ft = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, n, r) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[r + 1], s[0]);
  return new mt(e, s, G);
}, Et = (s, t) => {
  if (Z) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = I.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, s.appendChild(i);
  }
}, it = Z ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return At(e);
})(s) : s;
const { is: St, defineProperty: kt, getOwnPropertyDescriptor: Dt, getOwnPropertyNames: Ct, getOwnPropertySymbols: Mt, getPrototypeOf: Nt } = Object, B = globalThis, nt = B.trustedTypes, Pt = nt ? nt.emptyScript : "", Tt = B.reactiveElementPolyfillSupport, H = (s, t) => s, Y = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Pt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, yt = (s, t) => !St(s, t), rt = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: yt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), B.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = rt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && kt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: r } = Dt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const a = n?.call(this);
      r?.call(this, o), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = Nt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, i = [...Ct(e), ...Mt(e)];
      for (const n of i) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, n] of e) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) e.unshift(it(n));
    } else t !== void 0 && e.push(it(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Et(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : Y).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const r = i.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Y;
      this._$Em = n;
      const a = o.fromAttribute(e, r.type);
      this[n] = a ?? this._$Ej?.get(n) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? yt)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: r }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, r] of i) {
        const { wrapped: o } = r, a = this[n];
        o !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, r, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[H("elementProperties")] = /* @__PURE__ */ new Map(), N[H("finalized")] = /* @__PURE__ */ new Map(), Tt?.({ ReactiveElement: N }), (B.reactiveElementVersions ??= []).push("2.1.2");
const X = globalThis, ot = (s) => s, j = X.trustedTypes, at = j ? j.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, gt = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, bt = "?" + E, Ut = `<${bt}>`, C = document, W = () => C.createComment(""), R = (s) => s === null || typeof s != "object" && typeof s != "function", Q = Array.isArray, Ot = (s) => Q(s) || typeof s?.[Symbol.iterator] == "function", K = `[ 	
\f\r]`, V = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, lt = />/g, k = RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, ut = /"/g, $t = /^(?:script|style|textarea|title)$/i, Vt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), v = Vt(1), U = /* @__PURE__ */ Symbol.for("lit-noChange"), m = /* @__PURE__ */ Symbol.for("lit-nothing"), dt = /* @__PURE__ */ new WeakMap(), D = C.createTreeWalker(C, 129);
function vt(s, t) {
  if (!Q(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return at !== void 0 ? at.createHTML(t) : t;
}
const Ht = (s, t) => {
  const e = s.length - 1, i = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = V;
  for (let a = 0; a < e; a++) {
    const c = s[a];
    let h, u, l = -1, d = 0;
    for (; d < c.length && (o.lastIndex = d, u = o.exec(c), u !== null); ) d = o.lastIndex, o === V ? u[1] === "!--" ? o = ct : u[1] !== void 0 ? o = lt : u[2] !== void 0 ? ($t.test(u[2]) && (n = RegExp("</" + u[2], "g")), o = k) : u[3] !== void 0 && (o = k) : o === k ? u[0] === ">" ? (o = n ?? V, l = -1) : u[1] === void 0 ? l = -2 : (l = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? k : u[3] === '"' ? ut : ht) : o === ut || o === ht ? o = k : o === ct || o === lt ? o = V : (o = k, n = void 0);
    const _ = o === k && s[a + 1].startsWith("/>") ? " " : "";
    r += o === V ? c + Ut : l >= 0 ? (i.push(h), c.slice(0, l) + gt + c.slice(l) + E + _) : c + E + (l === -2 ? a : _);
  }
  return [vt(s, r + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class F {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const a = t.length - 1, c = this.parts, [h, u] = Ht(t, e);
    if (this.el = F.createElement(h, i), D.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (n = D.nextNode()) !== null && c.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const l of n.getAttributeNames()) if (l.endsWith(gt)) {
          const d = u[o++], _ = n.getAttribute(l).split(E), f = /([.?@])?(.*)/.exec(d);
          c.push({ type: 1, index: r, name: f[2], strings: _, ctor: f[1] === "." ? Rt : f[1] === "?" ? Ft : f[1] === "@" ? zt : L }), n.removeAttribute(l);
        } else l.startsWith(E) && (c.push({ type: 6, index: r }), n.removeAttribute(l));
        if ($t.test(n.tagName)) {
          const l = n.textContent.split(E), d = l.length - 1;
          if (d > 0) {
            n.textContent = j ? j.emptyScript : "";
            for (let _ = 0; _ < d; _++) n.append(l[_], W()), D.nextNode(), c.push({ type: 2, index: ++r });
            n.append(l[d], W());
          }
        }
      } else if (n.nodeType === 8) if (n.data === bt) c.push({ type: 2, index: r });
      else {
        let l = -1;
        for (; (l = n.data.indexOf(E, l + 1)) !== -1; ) c.push({ type: 7, index: r }), l += E.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = C.createElement("template");
    return i.innerHTML = t, i;
  }
}
function O(s, t, e = s, i) {
  if (t === U) return t;
  let n = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const r = R(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(s), n._$AT(s, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = n : e._$Cl = n), n !== void 0 && (t = O(s, n._$AS(s, t.values), n, i)), t;
}
class Wt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, n = (t?.creationScope ?? C).importNode(e, !0);
    D.currentNode = n;
    let r = D.nextNode(), o = 0, a = 0, c = i[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let h;
        c.type === 2 ? h = new z(r, r.nextSibling, this, t) : c.type === 1 ? h = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (h = new It(r, this, t)), this._$AV.push(h), c = i[++a];
      }
      o !== c?.index && (r = D.nextNode(), o++);
    }
    return D.currentNode = C, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = O(this, t, e), R(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== U && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ot(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && R(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = F.createElement(vt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const r = new Wt(n, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = dt.get(t.strings);
    return e === void 0 && dt.set(t.strings, e = new F(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const r of t) n === e.length ? e.push(i = new z(this.O(W()), this.O(W()), this, this.options)) : i = e[n], i._$AI(r), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = ot(t).nextSibling;
      ot(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, r) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = m;
  }
  _$AI(t, e = this, i, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = O(this, t, e, 0), o = !R(t) || t !== this._$AH && t !== U, o && (this._$AH = t);
    else {
      const a = t;
      let c, h;
      for (t = r[0], c = 0; c < r.length - 1; c++) h = O(this, a[i + c], e, c), h === U && (h = this._$AH[c]), o ||= !R(h) || h !== this._$AH[c], h === m ? t = m : t !== m && (t += (h ?? "") + r[c + 1]), this._$AH[c] = h;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Rt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class Ft extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class zt extends L {
  constructor(t, e, i, n, r) {
    super(t, e, i, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? m) === U) return;
    const i = this._$AH, n = t === m && i !== m || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== m && (i === m || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class It {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const jt = X.litHtmlPolyfillSupport;
jt?.(F, z), (X.litHtmlVersions ??= []).push("3.3.3");
const Bt = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = e?.renderBefore ?? null;
    i._$litPart$ = n = new z(t.insertBefore(W(), r), r, void 0, e ?? {});
  }
  return n._$AI(s), n;
};
const tt = globalThis;
class P extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Bt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return U;
  }
}
P._$litElement$ = !0, P.finalized = !0, tt.litElementHydrateSupport?.({ LitElement: P });
const Lt = tt.litElementPolyfillSupport;
Lt?.({ LitElement: P });
(tt.litElementVersions ??= []).push("4.2.2");
const Kt = 365.2425, qt = 366 * 50, pt = /* @__PURE__ */ new Map(), Jt = {
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
}, Yt = {
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
function wt(s) {
  return s === "Wh" || s === "kWh" || s === "MWh";
}
function Zt(s, t) {
  if (!(!Number.isFinite(s) || !wt(t)))
    return t === "Wh" ? s / 1e3 : t === "MWh" ? s * 1e3 : s;
}
function Gt(s) {
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
function Xt(s, t) {
  return !s || s === "PV-Amortisation" ? t : s;
}
function Qt(s, t, e, i) {
  if (e <= 0 || s > t) return;
  const n = Math.max(1, (t.getTime() - s.getTime()) / 864e5);
  return new Date(s.getTime() + i / e * n * 864e5);
}
function w(s) {
  return new Date(s.getFullYear(), s.getMonth(), s.getDate());
}
function T(s, t) {
  const e = new Date(s.getFullYear(), 0, 0), i = Math.round((w(s).getTime() - e.getTime()) / 864e5), n = t * Math.PI / 180, r = 0.409 * Math.sin(2 * Math.PI * i / 365 - 1.39), o = -Math.tan(n) * Math.tan(r), a = Math.acos(Math.max(-1, Math.min(1, o))), c = a * Math.sin(n) * Math.sin(r) + Math.cos(n) * Math.cos(r) * Math.sin(a);
  return Math.max(0, c);
}
function te(s, t, e, i, n) {
  const r = /* @__PURE__ */ new Date(`${s}T00:00:00`);
  if (Number.isNaN(r.getTime()) || !Number.isFinite(t.getTime()) || !Number.isFinite(e) || e <= 0 || !Number.isFinite(i) || i <= 0 || !Number.isFinite(n) || n < -90 || n > 90 || r > t)
    return;
  const o = w(t);
  let a = 0;
  for (let _ = w(r); _ <= o; _.setDate(_.getDate() + 1))
    a += T(_, n);
  if (!Number.isFinite(a) || a <= 0) return;
  const c = e / a, h = Math.max(1e-9, i * Number.EPSILON * 16);
  if (e >= i) {
    let _ = 0;
    for (let f = w(r); f <= o; f.setDate(f.getDate() + 1))
      if (_ += T(f, n) * c, _ >= i - h) return new Date(f);
    return;
  }
  let u = e;
  const l = new Date(o), d = 366 * 50;
  for (let _ = 0; _ < d; _ += 1) {
    if (u >= i - h) return new Date(l);
    l.setDate(l.getDate() + 1), u += T(l, n) * c;
  }
}
function et(s, t) {
  return typeof s == "number" && Number.isFinite(s) && s >= -90 && s <= 90 && typeof t == "number" && Number.isFinite(t) && t >= -180 && t <= 180;
}
function S(s) {
  return [
    s.getFullYear(),
    String(s.getMonth() + 1).padStart(2, "0"),
    String(s.getDate()).padStart(2, "0")
  ].join("-");
}
function q(s, t, e) {
  const i = Math.max(
    0,
    (w(s).getTime() - w(t).getTime()) / 864e5
  );
  return 1 / (1 + e / 100) ** (i / Kt);
}
function ee(s) {
  const t = s.start ?? s.start_time;
  if (typeof t == "number")
    return !Number.isFinite(t) || Number.isNaN(new Date(t).getTime()) ? void 0 : S(new Date(t));
  if (!(typeof t != "string" || Number.isNaN(new Date(t).getTime())))
    return t.slice(0, 10);
}
function J(s) {
  const t = /* @__PURE__ */ new Map();
  let e;
  for (const i of s ?? []) {
    const n = ee(i), r = typeof i.sum == "number" ? i.sum : Number.NaN;
    if (!n || !Number.isFinite(r)) {
      e = void 0;
      continue;
    }
    if (e !== void 0) {
      const o = r - e;
      o >= 0 && t.set(n, o);
    }
    e = r;
  }
  return t;
}
function se(s, t) {
  const e = J(t?.[s.export_energy_entity]), i = s.self_consumption_entity ? J(t?.[s.self_consumption_entity]) : void 0, n = s.production_energy_entity ? J(t?.[s.production_energy_entity]) : void 0;
  return [.../* @__PURE__ */ new Set([
    ...e.keys(),
    ...i?.keys() ?? [],
    ...n?.keys() ?? []
  ])].sort().flatMap((o) => {
    const a = e.get(o);
    if (a === void 0) return [];
    const c = i ? i.get(o) : n?.get(o) === void 0 ? void 0 : Math.max(0, n.get(o) - a);
    return c === void 0 || !Number.isFinite(c) || c < 0 ? [] : [{ date: o, selfConsumption: c, exported: a }];
  });
}
function xt(s, t) {
  const e = s.self_consumption_entity ? ["direct", s.self_consumption_entity, s.export_energy_entity] : ["derived", s.production_energy_entity, s.export_energy_entity];
  return JSON.stringify([e, s.start_date, t]);
}
function ie(s, t, e = /* @__PURE__ */ new Date()) {
  if (!s.callWS || !t.use_historical_statistics || (t.annual_discount_rate ?? 0) <= 0)
    return;
  const i = /* @__PURE__ */ new Date(`${t.start_date}T00:00:00`);
  if (Number.isNaN(i.getTime()) || Number.isNaN(e.getTime())) return;
  const n = w(i);
  n.setDate(n.getDate() - 1);
  const r = w(e), o = w(e);
  o.setDate(o.getDate() - 1);
  const a = S(o), c = xt(t, a), h = pt.get(c);
  if (h) return h;
  const u = t.self_consumption_entity ? [t.self_consumption_entity, t.export_energy_entity] : [t.production_energy_entity, t.export_energy_entity], l = s.callWS({
    type: "recorder/statistics_during_period",
    start_time: `${S(n)}T00:00:00`,
    end_time: `${S(r)}T00:00:00`,
    statistic_ids: u,
    period: "day",
    types: ["sum"]
  }).then(
    (d) => d && typeof d == "object" ? d : void 0
  ).catch(() => {
  });
  return pt.set(c, l), l;
}
function ne(s, t, e, i) {
  const n = s.use_location_seasonality && et(i?.latitude, i?.longitude), r = [];
  for (let a = w(t); a <= w(e); a.setDate(a.getDate() + 1))
    r.push({
      date: new Date(a),
      weight: n ? T(a, i.latitude) : 1
    });
  return r.reduce((a, c) => a + c.weight, 0) > 0 ? r : r.map((a) => ({ ...a, weight: 1 }));
}
function re(s, t, e, i, n, r) {
  const o = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`);
  if (Number.isNaN(o.getTime()) || o > i) return [];
  const a = ne(s, o, i, n), c = new Map((r ?? []).map((d) => [d.date, d])), h = (d, _) => {
    const f = a.map(
      ({ date: g }) => Math.max(0, c.get(S(g))?.[_] ?? 0)
    ), y = f.reduce((g, b) => g + b, 0), p = a.reduce(
      (g, b, M) => g + (f[M] > 0 ? 0 : b.weight),
      0
    ), x = a.map((g, b) => y > 0 && f[b] > 0 ? f[b] : p > 0 ? d * g.weight / p : 0), A = x.reduce((g, b) => g + b, 0);
    return A > 0 ? x.map((g) => g * d / A) : x;
  }, u = h(Math.max(0, t), "selfConsumption"), l = h(Math.max(0, e), "exported");
  return a.map((d, _) => ({
    date: S(d.date),
    selfConsumption: u[_],
    exported: l[_]
  }));
}
function oe(s, t, e, i) {
  const n = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`), r = s.annual_discount_rate ?? 0;
  let o = 0, a = 0, c = 0, h;
  for (const y of e) {
    const p = /* @__PURE__ */ new Date(`${y.date}T00:00:00`), x = y.selfConsumption * s.electricity_price * q(p, n, r), A = y.exported * s.feed_in_tariff * q(p, n, r);
    o += x, a += A, c += x + A, !h && c >= s.investment_cost && (h = p);
  }
  if (h) return { ownValue: o, exportValue: a, paybackDate: h };
  const u = s.use_location_seasonality && et(i?.latitude, i?.longitude), l = e.reduce(
    (y, p) => y + (u ? T(/* @__PURE__ */ new Date(`${p.date}T00:00:00`), i.latitude) : 1),
    0
  ), d = e.reduce(
    (y, p) => y + p.selfConsumption * s.electricity_price + p.exported * s.feed_in_tariff,
    0
  );
  if (l <= 0 || d <= 0) return { ownValue: o, exportValue: a };
  const _ = d / l, f = w(t);
  for (let y = 0; y < qt; y += 1) {
    f.setDate(f.getDate() + 1);
    const p = u ? T(f, i.latitude) : 1;
    if (c += _ * p * q(f, n, r), c >= s.investment_cost)
      return { ownValue: o, exportValue: a, paybackDate: new Date(f) };
  }
  return { ownValue: o, exportValue: a };
}
function ae(s, t, e, i = /* @__PURE__ */ new Date(), n, r) {
  const o = Math.max(0, t - (s.self_consumption_baseline ?? 0)), a = Math.max(0, e - (s.export_energy_baseline ?? 0)), c = o * s.electricity_price, h = a * s.feed_in_tariff;
  if ((s.annual_discount_rate ?? 0) > 0) {
    const g = re(
      s,
      o,
      a,
      i,
      n,
      r
    ), b = oe(s, i, g, n), M = b.ownValue + b.exportValue;
    return {
      selfConsumption: o,
      exported: a,
      ownValue: b.ownValue,
      exportValue: b.exportValue,
      benefit: M,
      progress: Math.min(100, M / s.investment_cost * 100),
      paybackDate: b.paybackDate
    };
  }
  const u = c, l = h, d = u + l, _ = Math.min(100, d / s.investment_cost * 100), f = /* @__PURE__ */ new Date(`${s.start_date}T00:00:00`), y = Qt(f, i, d, s.investment_cost), p = n?.latitude, x = n?.longitude, A = s.use_location_seasonality && et(p, x) ? te(
    s.start_date,
    i,
    d,
    s.investment_cost,
    p
  ) ?? y : y;
  return {
    selfConsumption: o,
    exported: a,
    ownValue: u,
    exportValue: l,
    benefit: d,
    progress: _,
    paybackDate: A
  };
}
function _t(s, t) {
  const e = !!s.self_consumption_entity;
  return `pv-payback-card:last-valid:${JSON.stringify([
    e ? "direct-self-consumption" : "derived-self-consumption",
    e ? s.self_consumption_entity : s.production_energy_entity,
    s.export_energy_entity,
    s.start_date,
    s.self_consumption_baseline ?? 0,
    s.export_energy_baseline ?? 0
  ])}:${t}`;
}
function ce(s) {
  if (s)
    try {
      const t = JSON.parse(s);
      return typeof t.value != "number" || !Number.isFinite(t.value) || t.value < 0 ? void 0 : {
        value: t.value,
        timestamp: typeof t.timestamp == "string" ? t.timestamp : void 0
      };
    } catch {
      return;
    }
}
function le(s, t) {
  try {
    return ce(s.getItem(t));
  } catch {
    return;
  }
}
function he(s, t) {
  return s !== void 0 && s >= 0 ? t && s < t.value ? { value: t.value, cached: !0, regression: !0 } : { value: s, cached: !1, regression: !1 } : t ? { value: t.value, cached: !0, regression: !1 } : { cached: !1, regression: !1 };
}
function ue(s) {
  if (!s.start_date || Number.isNaN((/* @__PURE__ */ new Date(`${s.start_date}T00:00:00`)).getTime()))
    return "start_date";
  for (const t of ["investment_cost", "electricity_price", "feed_in_tariff"])
    if (!Number.isFinite(s[t]) || s[t] < 0) return t;
  if (s.investment_cost <= 0) return "investment_cost";
  if (!Number.isFinite(s.annual_discount_rate ?? 0) || (s.annual_discount_rate ?? 0) < 0)
    return "annual_discount_rate";
  if (!s.export_energy_entity || !s.self_consumption_entity && !s.production_energy_entity)
    return "energy entity";
}
class de extends P {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
  constructor() {
    super(), this._config = {};
  }
  setConfig(t) {
    this._config = { ...t };
  }
  changed(t) {
    const e = t.target, i = [
      "investment_cost",
      "electricity_price",
      "feed_in_tariff",
      "self_consumption_baseline",
      "export_energy_baseline",
      "annual_discount_rate"
    ].includes(e.name), n = e.type === "checkbox" ? e.checked : i ? Number(e.value) : e.value;
    this._config = { ...this._config, [e.name]: n }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  entityChanged(t, e) {
    const i = e.detail?.value;
    typeof i == "string" && (this._config = { ...this._config, [t]: i }, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: !0,
        composed: !0
      })
    ));
  }
  entityField(t, e) {
    const i = String(this._config[t] ?? "");
    return this.hass && customElements.get("ha-entity-picker") ? v`<ha-entity-picker
        .hass=${this.hass}
        .value=${i}
        .label=${e}
        .includeDomains=${["sensor"]}
        .allowCustomEntity=${!0}
        @value-changed=${(r) => this.entityChanged(t, r)}
      ></ha-entity-picker>` : v`<label
      >${e}<input name=${t} type="text" .value=${i} @change=${this.changed}
    /></label>`;
  }
  render() {
    const t = Yt[(this._config.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"], e = [
      ["start_date", t.start_date, "date"],
      ["investment_cost", t.investment_cost, "number"],
      ["electricity_price", t.electricity_price, "number"],
      ["feed_in_tariff", t.feed_in_tariff, "number"]
    ], i = [
      ["self_consumption_baseline", t.self_consumption_baseline, "number"],
      ["export_energy_baseline", t.export_energy_baseline, "number"],
      ["annual_discount_rate", t.annual_discount_rate, "number"]
    ], n = ([r, o, a]) => v`<label
        >${o}<input
          name=${r}
          type=${a}
          step="any"
          .value=${String(this._config[r] ?? "")}
          @change=${this.changed}
      /></label>`;
    return v`${e.map(
      n
    )}${this.entityField("self_consumption_entity", t.self_consumption_entity)}${this.entityField("production_energy_entity", t.production_energy_entity)}${this.entityField("export_energy_entity", t.export_energy_entity)}${i.map(
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
      (r) => v`<label
          ><input
            name=${r}
            type="checkbox"
            .checked=${r === "show_contribution_segments" || r === "use_location_seasonality" || r === "use_historical_statistics" ? this._config[r] === !0 : this._config[r] !== !1}
            @change=${this.changed}
          />${t[r]}</label
        >`
    )}`;
  }
  static styles = ft`
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
customElements.define("pv-payback-card-editor", de);
class pe extends P {
  static properties = { hass: { attribute: !1 }, _config: { state: !0 } };
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
  setConfig(t) {
    this._config = Gt(t), this._historicalStatistics = void 0, this._historicalStatisticsKey = void 0, this._calculationCache = void 0;
  }
  _historicalStatistics;
  _historicalStatisticsKey;
  _calculationCache;
  updated() {
    const t = this._config;
    if (!t || !this.hass?.callWS || !t.use_historical_statistics || (t.annual_discount_rate ?? 0) <= 0)
      return;
    const e = w(/* @__PURE__ */ new Date());
    e.setDate(e.getDate() - 1);
    const i = xt(t, S(e));
    this._historicalStatisticsKey !== i && (this._historicalStatisticsKey = i, ie(this.hass, t)?.then((n) => {
      n && this._historicalStatisticsKey === i && (this._historicalStatistics = n, this.requestUpdate());
    }));
  }
  getCardSize() {
    return 4;
  }
  readEnergy(t, e, i) {
    const n = this.hass?.states[e], r = n ? Number(n.state) : Number.NaN, o = Zt(r, n?.attributes?.unit_of_measurement), a = le(localStorage, _t(t, e)), c = he(o, a);
    if (c.value !== void 0) {
      if (!c.cached) {
        const u = JSON.stringify({
          value: c.value,
          timestamp: n?.last_updated ?? (/* @__PURE__ */ new Date()).toISOString()
        });
        try {
          localStorage.setItem(_t(t, e), u);
        } catch {
        }
      }
      return {
        value: c.value,
        cached: c.cached,
        timestamp: c.cached ? a?.timestamp : n?.last_updated,
        warning: c.regression ? `${e}: ${i.counterRegression}` : void 0
      };
    }
    const h = n?.attributes?.unit_of_measurement;
    return {
      cached: !1,
      warning: n && !wt(h) ? `${e}: ${i.unsupportedUnit}` : `${e}: ${i.entityUnavailable}`
    };
  }
  text() {
    return Jt[(this._config?.locale ?? this.hass?.locale?.language ?? navigator.language).startsWith("de") ? "de" : "en"];
  }
  formatMoney(t) {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      style: "currency",
      currency: this._config?.currency ?? this.hass?.config?.currency ?? "EUR",
      maximumFractionDigits: 0
    }).format(t);
  }
  formatEnergy(t) {
    return new Intl.NumberFormat(this._config?.locale ?? this.hass?.locale?.language, {
      maximumFractionDigits: 0
    }).format(t) + " kWh";
  }
  openMoreInfo(t) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  handleBreakdownKeydown(t, e) {
    t.key !== "Enter" && t.key !== " " || (t.preventDefault(), this.openMoreInfo(e));
  }
  render() {
    const t = this._config;
    if (!t) return m;
    const e = this.text(), i = ue(t);
    if (i)
      return v`<ha-card
        ><div class="content error" role="alert">${e.invalid}: ${i}</div></ha-card
      >`;
    const n = t.self_consumption_entity ? this.readEnergy(t, t.self_consumption_entity, e) : void 0, r = !n && t.production_energy_entity ? this.readEnergy(t, t.production_energy_entity, e) : void 0, o = this.readEnergy(t, t.export_energy_entity, e), a = [n, r, o].filter(
      ($) => !!$
    ), c = n?.value, h = r?.value, u = o.value;
    if (u === void 0 || n !== void 0 && c === void 0 || r !== void 0 && h === void 0)
      return v`<ha-card
        ><div class="content error" role="alert">
          ${e.unavailable}${a.map(
        ($) => $.warning ? v`<br />${$.warning}` : m
      )}
        </div></ha-card
      >`;
    const l = c ?? h - u, d = /* @__PURE__ */ new Date(), _ = {
      latitude: this.hass?.config?.latitude,
      longitude: this.hass?.config?.longitude
    }, f = this._historicalStatistics ? `loaded:${this._historicalStatisticsKey ?? ""}` : `approximation:${this._historicalStatisticsKey ?? ""}`, y = JSON.stringify([
      t,
      l,
      u,
      S(d),
      _,
      f
    ]);
    this._calculationCache?.key !== y && (this._calculationCache = {
      key: y,
      calculation: ae(
        t,
        l,
        u,
        d,
        _,
        se(t, this._historicalStatistics)
      )
    });
    const p = this._calculationCache.calculation, x = a.some(($) => $.cached), A = a.map(($) => $.timestamp).filter(Boolean).sort().at(0), g = x ? `${e.cached}${A ? `: ${new Intl.DateTimeFormat(t.locale ?? this.hass?.locale?.language, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(A))}` : ""}${a.filter(($) => $.warning).map(($) => ` ${$.warning}`).join("")}` : void 0, b = Math.min(
      100,
      Math.max(0, p.ownValue / t.investment_cost * 100)
    ), M = Math.min(
      Math.max(0, 100 - b),
      Math.max(0, p.exportValue / t.investment_cost * 100)
    );
    return v`<ha-card>
      <div class="content">
        <div class="header">
          <div class="header-title">
            <ha-icon .icon=${t.icon ?? "mdi:solar-power-variant"}></ha-icon
            ><span>${Xt(t.name, e.title)}</span>
          </div>
          <div class="header-meta">
            ${g ? v`<span
                    class="warning-indicator"
                    role="img"
                    aria-label=${g}
                    title=${g}
                    ><ha-icon icon="mdi:alert"></ha-icon
                  ></span>` : m}
            ${t.show_progress ? v`<span class="header-progress">${p.progress.toFixed(1)}%</span>` : m}
          </div>
        </div>
        <div class="benefit">
          <span>${e.benefit}</span><strong>${this.formatMoney(p.benefit)}</strong>
        </div>
        ${t.show_progress ? v`<div
                class="bar ${t.show_contribution_segments ? "contribution-segments" : ""}"
                role="progressbar"
                aria-label=${e.progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${p.progress}
              >
                ${t.show_contribution_segments ? v`<div class="contribution-own" style=${`width:${b}%`}></div>
                        <div
                          class="contribution-export"
                          style=${`width:${M}%`}
                        ></div>` : v`<div style=${`width:${p.progress}%`}></div>`}
              </div>` : m}
        ${t.show_breakdown && (t.show_energy_values || t.show_money_values) ? v`<div
                class="breakdown ${t.show_contribution_segments ? "contribution-segments" : ""}"
              >
                <div
                  class="own"
                  role=${t.self_consumption_entity ? "button" : m}
                  tabindex=${t.self_consumption_entity ? "0" : m}
                  aria-label=${t.self_consumption_entity ? e.own : m}
                  @click=${t.self_consumption_entity ? () => this.openMoreInfo(t.self_consumption_entity) : m}
                  @keydown=${t.self_consumption_entity ? ($) => this.handleBreakdownKeydown($, t.self_consumption_entity) : m}
                >
                  <span>${e.own}</span
                  ><b
                    >${t.show_energy_values && t.show_money_values ? `${this.formatEnergy(p.selfConsumption)} · ${this.formatMoney(p.ownValue)}` : t.show_energy_values ? this.formatEnergy(p.selfConsumption) : this.formatMoney(p.ownValue)}</b
                  >
                </div>
                <div
                  class="export"
                  role="button"
                  tabindex="0"
                  aria-label=${e.export}
                  @click=${() => this.openMoreInfo(t.export_energy_entity)}
                  @keydown=${($) => this.handleBreakdownKeydown($, t.export_energy_entity)}
                >
                  <span>${e.export}</span
                  ><b
                    >${t.show_energy_values && t.show_money_values ? `${this.formatEnergy(p.exported)} · ${this.formatMoney(p.exportValue)}` : t.show_energy_values ? this.formatEnergy(p.exported) : this.formatMoney(p.exportValue)}</b
                  >
                </div>
              </div>` : m}
        ${t.show_payback_date ? v`<div class="date"><span>${e.expected}</span><b>${p.paybackDate ? new Intl.DateTimeFormat(t.locale ?? this.hass?.locale?.language, { dateStyle: "medium" }).format(p.paybackDate) : e.noProjection}</b></div>` : m}
      </div>
    </ha-card>`;
  }
  static styles = ft`
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
customElements.define("pv-payback-card", pe);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "pv-payback-card",
  name: "PV Payback Card",
  description: "Displays PV financial payback from cumulative energy sensors."
});
export {
  pe as PVPaybackCard,
  de as PVPaybackCardEditor,
  _t as cacheKey,
  ae as calculatePayback,
  te as calculateSeasonalPaybackDate,
  he as chooseEnergyValue,
  se as dailyEnergyFromStatistics,
  Xt as displayName,
  re as distributeHistoricalEnergy,
  Zt as energyToKwh,
  xt as historicalStatisticsCacheKey,
  ie as loadHistoricalStatistics,
  ce as parseCachedEnergy,
  le as readCachedEnergy,
  J as statisticDailyDeltas,
  Gt as withDisplayDefaults
};
