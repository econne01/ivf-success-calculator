import { useRef, useState } from 'react'
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Popover,
  ListBox,
  ListBoxItem,
  NumberField,
  Select,
  SelectValue,
  Group,
  Checkbox,
  CheckboxGroup
} from 'react-aria-components';
import axios from 'axios';
import { FormCheckbox } from './FormCheckbox';
import './App.css'
import './AppForm.css'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string[]>([]); // State to manage selected reason(s) for IVF
  const formRef = useRef<HTMLFormElement>(null); // Add a ref for the form

  // Handle form submission
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // Convert FormData to an object with string values
    const formData = new FormData(event.currentTarget);
    const data: Record<string, string> = {};
  
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        data[key] = value; // Assign string values directly
      } else {
        console.warn(`Skipping non-string value for key: ${key}`);
      }
    });
  
    // Add the selected reason(s) to the data
    data['reasonForIVF'] = selectedReason.join(',');
  
    // Combine height fields
    data['height'] = (
      parseInt(data['height-feet'] || '0') * 12 +
      parseInt(data['height-inches'] || '0')
    ).toString();
  
    setIsLoading(true);
    console.log('Form data:', data);
  
    setTimeout(() => {
      console.log('Simulating a delay...');
      axios
        .post('/api/calculate-success-rate', JSON.stringify(data))
        .then((response) => {
          console.log('Success rate:', response.data.successRate);
          clearForm();
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1000);
  };

  // Function to clear the form inputs
  const clearForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <>
      <div className="app-header">
        <h1 className="app-title">IVF Success Rate Calculator</h1>
      </div>
      <div className="app-body">
        <div className="instructions-container">
          <h2>Estimate your chances of having a baby with IVF</h2>
          <p>
            This is a simple form that calculates the success rate of IVF based on user input.
            The calculations follow the{' '}
            <a href="https://www.cdc.gov/art/ivf-success-estimator/index.html">CDC estimates</a>.
            Please note that this tool has some limitations, including that it can only generate estimates for
            specific ranges for age, height and weight.
          </p>
          <p>
            Please note that the IVF Success Estimator does not provide medical advice, diagnosis, or treatment.
            You should always talk with your doctor about your specific treatment plan and potential for success.
            </p>
          <h2>Fill out the form below to get your estimated rate of success</h2>
          {isLoading && <p>Loading...</p>}
        </div>
        <div className="form-container">
          <Form
            ref={formRef}
            onSubmit={onSubmit}
            onReset={clearForm}
          >
            <Select name="isUsingOwnEggs" isRequired>
              <Label>Do you plan to use your own eggs or donor eggs?</Label>
              <Button>
                <SelectValue />
                <span aria-hidden="true">▼</span>
              </Button>
              <Popover>
                <ListBox>
                  <ListBoxItem id="own-eggs">Own Eggs</ListBoxItem>
                  <ListBoxItem id="donor-eggs">Donor Eggs</ListBoxItem>
                </ListBox>
              </Popover>
            </Select>

            <Select name="hasPrevIVF" isRequired>
              <Label>How many times have you used IVF in the past (include all cycles, even those not resulting in pregnancy)?</Label>
              <Button>
                <SelectValue />
                <span aria-hidden="true">▼</span>
              </Button>
              <Popover>
                <ListBox>
                  <ListBoxItem id="0">I've never used IVF</ListBoxItem>
                  <ListBoxItem id="1">1</ListBoxItem>
                  <ListBoxItem id="2">2</ListBoxItem>
                  <ListBoxItem id="3">3 or more</ListBoxItem>
                </ListBox>
              </Popover>
            </Select>

            <Select name="numPrevPregnancies" isRequired>
              <Label>How many prior pregnancies have you had?</Label>
              <Button>
                <SelectValue />
                <span aria-hidden="true">▼</span>
              </Button>
              <Popover>
                <ListBox>
                  <ListBoxItem id="0">None</ListBoxItem>
                  <ListBoxItem id="1">1</ListBoxItem>
                  <ListBoxItem id="2">2 or more</ListBoxItem>
                </ListBox>
              </Popover>
            </Select>
            
            <Select name="numPrevDeliveries" isRequired>
              <Label>How many prior births have you had? (Count only the number of deliveries. Twins counts as one time)</Label>
              <Button>
                <SelectValue />
                <span aria-hidden="true">▼</span>
              </Button>
              <Popover>
                <ListBox>
                  <ListBoxItem id="0">None</ListBoxItem>
                  <ListBoxItem id="1">1</ListBoxItem>
                  <ListBoxItem id="2">2 or more</ListBoxItem>
                </ListBox>
              </Popover>
            </Select>

            <CheckboxGroup name="reasonForIVF" onChange={setSelectedReason}isRequired>
              <Label>What is the reason for your IVF treatment?</Label>
              <Group>
                <FormCheckbox value="tubal-factor" label={'Tubal Factor'}/>
                <FormCheckbox value="male-factor-infertility" label={'Male Factor Infertility'}/>
                <FormCheckbox value="endometriosis" label={'Endometriosis'}/>
                <FormCheckbox value="ovulatory-disorder" label={'Ovulatory Disorder'}/>
                <FormCheckbox value="diminished-ovarian-reserve" label={'Diminished Ovarian Reserve'}/>
                <FormCheckbox value="uterine-factor" label={'Uterine Factor'}/>
                <FormCheckbox value="other" label={'Other Reason'}/>
                <FormCheckbox value="unexplained" label={'Unexplained (Idiopathic) infertility '}/>
                <FormCheckbox value="no-reason" label={'I don’t know/no reason'}/>
              </Group>
              <FieldError />
            </CheckboxGroup>

            <NumberField name="age" minValue={20} maxValue={50} isRequired>
              <Label>Age (20-50)</Label>
              <Group>
                <Button slot="decrement" className="number-adjuster">-</Button>
                <Input />
                <Button slot="increment" className="number-adjuster">+</Button>
              </Group>
              <FieldError />
            </NumberField>

            <Group>
              <NumberField name="height-feet" minValue={4} maxValue={6} isRequired>
                <Label>Height (feet)</Label>
                <Group>
                  <Button slot="decrement" className="number-adjuster">-</Button>
                  <Input />
                  <Button slot="increment" className="number-adjuster">+</Button>
                </Group>
                <FieldError />
              </NumberField>
              <NumberField name="height-inches" minValue={0} maxValue={11} isRequired>
                <Label>Height (inches)</Label>
                <Group>
                  <Button slot="decrement" className="number-adjuster">-</Button>
                  <Input />
                  <Button slot="increment" className="number-adjuster">+</Button>
                </Group>
                <FieldError />
              </NumberField>
            </Group>
            
            <NumberField name="weight" minValue={80} maxValue={300} isRequired>
              <Label>Weight (lbs)</Label>
              <Group>
                <Button slot="decrement" className="number-adjuster">-</Button>
                <Input />
                <Button slot="increment" className="number-adjuster">+</Button>
              </Group>
              <FieldError />
            </NumberField>
            
            <Button type="submit">Submit</Button>
            <Button type="reset">Start Over</Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default App;
