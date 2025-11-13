// Define what an element looks like in our builder
export type ElementType = 'container' | 'text' | 'button' | 'image' | 'heading';

export interface ElementStyle {
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
}

export interface Element {
  id: string;
  type: ElementType;
  content?: string;        // Text content or image URL
  style: ElementStyle;
  children?: Element[];    // For containers (nested elements)
}
