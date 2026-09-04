export default function ExpandingHoverMenu({ label, children }) { return <details className="hover-menu"><summary>{label}</summary><div>{children}</div></details>; }
