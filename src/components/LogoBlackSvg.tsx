interface LogoBlackSvgProps {
  width?: number;
  height?: number;
}
export const LogoBlackSvg: React.FC<LogoBlackSvgProps> = ({
  width = 41,
  height = 31,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 41 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="3.83763"
        cy="3.83501"
        rx="3.83763"
        ry="3.83501"
        transform="matrix(0.866321 0.499488 -0.500512 0.86573 4.1499 2.13135)"
        fill="black"
      />
      <ellipse
        cx="3.83763"
        cy="3.83501"
        rx="3.83763"
        ry="3.83501"
        transform="matrix(0.866321 0.499488 -0.500512 0.86573 33.6616 0.214355)"
        fill="black"
      />
      <rect
        width="7.4354"
        height="20.1338"
        rx="3.7177"
        transform="matrix(0.866321 0.499488 -0.500512 0.86573 28.623 9.06982)"
        fill="black"
      />
      <rect
        width="7.4354"
        height="29.961"
        rx="3.7177"
        transform="matrix(0.866321 0.499488 -0.500512 0.86573 19.0259 0.424316)"
        fill="black"
      />
    </svg>
  );
};
