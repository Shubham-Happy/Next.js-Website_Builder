export type ElementType = 'container' | 'text' | 'button' | 'image' | 'heading' | 'section' | 'column' | 'input' | 'textarea';

export interface ElementStyle {
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
  lineHeight?: string;
  fontFamily?: string;
  
  // Positioning
  position?: 'relative' | 'absolute';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: number;
  
  // Advanced
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  flex?: string;
  minHeight?: string;
  maxWidth?: string;
  objectFit?: string;
  background?: string;
}

export interface Element {
  id: string;
  type: ElementType;
  content?: string;
  style: ElementStyle;
  children?: Element[];
  locked?: boolean;
  animation?: string;
}
