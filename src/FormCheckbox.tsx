import { Checkbox } from 'react-aria-components';
import './FormCheckbox.css';

// Define the type for the props
interface FormCheckboxProps {
  label: string;
  value: string;
}

export function FormCheckbox({ label, ...props }: FormCheckboxProps) {
  return (
    <Checkbox {...props}>
      <div className="checkbox">
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </div>
      {label}
    </Checkbox>
  );
}
