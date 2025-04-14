import { Checkbox, CheckboxProps } from 'react-aria-components';
import './FormCheckbox.css';

export function FormCheckbox({children, isSelected, ...props}: CheckboxProps) {
  return (
    <Checkbox isSelected {...props}>
      {({isIndeterminate}) => <>
        <div className={`checkbox ${isSelected ? 'form-checkbox-selected' : ''}`}>
          <svg viewBox="0 0 18 18" aria-hidden="true">
            {isIndeterminate
              ? <rect x={1} y={7.5} width={15} height={3} />
              : <polyline points="1 9 7 14 15 4" />
            }
          </svg>
        </div>
        {children}
      </>}
    </Checkbox>
  );
}
