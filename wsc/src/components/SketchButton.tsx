import type { ReactNode, MouseEventHandler } from 'react';
import SketchBox from './SketchBox';
import type { CrayonName } from '../lib/rough';

type Props = {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  color?: CrayonName;
  variant?: 'solid' | 'outline';
  seed?: number;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
};

export default function SketchButton({
  children,
  href,
  type = 'button',
  color = 'yellow',
  variant = 'solid',
  seed = 4,
  disabled,
  onClick,
  className = '',
}: Props) {
  const box = (
    <SketchBox
      fill={variant === 'solid' ? color : 'none'}
      fillStyle="zigzag"
      hachureGap={4.2}
      seed={seed}
      shadow
      underlay="#fffdf6"
      strokeWidth={2.8}
    />
  );
  const inner = (
    <>
      {box}
      <span className="sk-btn__label">{children}</span>
    </>
  );
  const cls = `sk-btn sk-btn--${variant} ${className}`;
  if (href)
    return (
      <a className={cls} href={href} onClick={onClick}>
        {inner}
      </a>
    );
  return (
    <button className={cls} type={type} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}
