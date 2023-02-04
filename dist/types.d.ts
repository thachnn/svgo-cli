export declare type XastDoctype = {
  type: 'doctype';
  name: string;
  data: {
    doctype: string;
  };
};

export declare type XastInstruction = {
  type: 'instruction';
  name: string;
  value: string;
};

export declare type XastComment = {
  type: 'comment';
  value: string;
};

export declare type XastCdata = {
  type: 'cdata';
  value: string;
};

export declare type XastText = {
  type: 'text';
  value: string;
};

export declare type XastElement = {
  type: 'element';
  name: string;
  attributes: Record<string, string>;
  children: Array<XastChild>;
};

export declare type XastChild =
  | XastDoctype
  | XastInstruction
  | XastComment
  | XastCdata
  | XastText
  | XastElement;

export declare type XastRoot = {
  type: 'root';
  children: Array<XastChild>;
};

export declare type XastParent = XastRoot | XastElement;

export declare type XastNode = XastRoot | XastChild;

export declare type StringifyOptions = {
  doctypeStart?: string;
  doctypeEnd?: string;
  procInstStart?: string;
  procInstEnd?: string;
  tagOpenStart?: string;
  tagOpenEnd?: string;
  tagCloseStart?: string;
  tagCloseEnd?: string;
  tagShortStart?: string;
  tagShortEnd?: string;
  attrStart?: string;
  attrEnd?: string;
  commentStart?: string;
  commentEnd?: string;
  cdataStart?: string;
  cdataEnd?: string;
  textStart?: string;
  textEnd?: string;
  indent?: number | string;
  regEntities?: RegExp;
  regValEntities?: RegExp;
  encodeEntity?: (char: string) => string;
  pretty?: boolean;
  useShortTags?: boolean;
  eol?: 'lf' | 'crlf';
  finalNewline?: boolean;
};

declare type VisitorNode<Node> = {
  enter?: (node: Node, parentNode: XastParent) => void | symbol;
  exit?: (node: Node, parentNode: XastParent) => void;
};

declare type VisitorRoot = {
  enter?: (node: XastRoot, parentNode: null) => void;
  exit?: (node: XastRoot, parentNode: null) => void;
};

export declare type Visitor = {
  doctype?: VisitorNode<XastDoctype>;
  instruction?: VisitorNode<XastInstruction>;
  comment?: VisitorNode<XastComment>;
  cdata?: VisitorNode<XastCdata>;
  text?: VisitorNode<XastText>;
  element?: VisitorNode<XastElement>;
  root?: VisitorRoot;
};

export declare type PluginInfo = {
  path?: string;
  multipassCount: number;
};

export declare type Plugin<Params> = (
  root: XastRoot,
  params: Params,
  info: PluginInfo
) => null | Visitor;

export declare type Specificity = [number, number, number, number];

export declare type StylesheetDeclaration = {
  name: string;
  value: string;
  important: boolean;
};

export declare type StylesheetRule = {
  dynamic: boolean;
  selectors: string;
  specificity: Specificity;
  declarations: Array<StylesheetDeclaration>;
};

export declare type Stylesheet = {
  rules: Array<StylesheetRule>;
  parents: Map<XastElement, XastParent>;
};

declare type StaticStyle = {
  type: 'static';
  inherited: boolean;
  value: string;
};

declare type DynamicStyle = {
  type: 'dynamic';
  inherited: boolean;
};

export declare type ComputedStyles = Record<string, StaticStyle | DynamicStyle>;

export declare type PathDataCommand =
  | 'M'
  | 'm'
  | 'Z'
  | 'z'
  | 'L'
  | 'l'
  | 'H'
  | 'h'
  | 'V'
  | 'v'
  | 'C'
  | 'c'
  | 'S'
  | 's'
  | 'Q'
  | 'q'
  | 'T'
  | 't'
  | 'A'
  | 'a';

export declare type PathDataItem = {
  command: PathDataCommand;
  args: Array<number>;
};
