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
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    textAlign: style.textAlign,
    width: style.width,
    height: style.height,
  };

  switch (type) {
    case 'container':
      return (
        <div style={inlineStyle} className="border border-gray-200 min-h-[100px]">
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
          {content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </p>
      );

    case 'button':
      return (
        <button
          style={inlineStyle}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
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

    default:
      return null;
  }
}
