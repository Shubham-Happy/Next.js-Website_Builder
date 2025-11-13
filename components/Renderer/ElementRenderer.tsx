import { Element } from '../../types/builder';

interface Props {
  element: Element;
}

export function ElementRenderer({ element }: Props) {
  const { type, content, style, children } = element;

  const inlineStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    padding: style.padding || '12px',
    margin: style.margin,
    borderRadius: style.borderRadius,
    border: style.border,
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    textAlign: style.textAlign,
    width: style.width,
    height: style.height,
    lineHeight: style.lineHeight,
    fontFamily: style.fontFamily,
    boxShadow: style.boxShadow,
    opacity: style.opacity,
    display: style.display,
    flexDirection: style.flexDirection,
    justifyContent: style.justifyContent,
    alignItems: style.alignItems,
    gap: style.gap,
    flex: style.flex,
    minHeight: style.minHeight,
    maxWidth: style.maxWidth,
    objectFit: style.objectFit,
    background: style.background,
  };

  switch (type) {
    case 'container':
    case 'section':
      return (
        <div style={inlineStyle} className="min-h-[100px]">
          {children?.map((child) => (
            <ElementRenderer key={child.id} element={child} />
          ))}
        </div>
      );

    case 'heading':
      return (
        <h1 style={inlineStyle} className="text-3xl font-bold">
          {content || 'Heading Text'}
        </h1>
      );

    case 'text':
      return (
        <p style={inlineStyle}>
          {content || 'Lorem ipsum dolor sit amet.'}
        </p>
      );

    case 'button':
      return (
        <button
          style={inlineStyle}
          className="px-6 py-2 rounded transition"
        >
          {content || 'Click Me'}
        </button>
      );

    case 'image':
      return (
        <img
          src={content || 'https://via.placeholder.com/400x300'}
          alt="Element"
          style={inlineStyle}
          className="max-w-full"
        />
      );

    case 'input':
      return (
        <input
          type="text"
          placeholder={content || 'Enter text...'}
          style={inlineStyle}
          className="outline-none"
        />
      );

    case 'textarea':
      return (
        <textarea
          placeholder={content || 'Enter text...'}
          style={inlineStyle}
          className="outline-none resize-none"
        />
      );

    default:
      return null;
  }
}
