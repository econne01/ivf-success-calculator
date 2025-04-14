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
  CheckboxGroup
} from 'react-aria-components';
import axios from 'axios';
import { FormCheckbox } from './FormCheckbox';
import './App.css'
import './AppForm.css'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTubalFactor, setSelectedTubalFactor] = useState<boolean>(false);
  const [selectedMaleInfertility, setSelectedMaleInfertility] = useState<boolean>(false);
  const [selectedEndometriosis, setSelectedEndometriosis] = useState<boolean>(false);
  const [selectedOvulatoryDisorder, setSelectedOvulatoryDisorder] = useState<boolean>(false);
  const [selectedDiminishedReserve, setSelectedDiminishedReserve] = useState<boolean>(false);
  const [selectedUterineFactor, setSelectedUterineFactor] = useState<boolean>(false);
  const [selectedOtherReason, setSelectedOtherReason] = useState<boolean>(false);
  const [selectedUnexplainedReason, setSelectedUnexplainedReason] = useState<boolean>(false);
  const [selectedUnknownReason, setSelectedUnknownReason] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null); // Add a ref for the form

  // Handle form submission
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // Convert FormData to an object with string values (ie, ignore Files)
    // Then prepare the data for submission to backend
    const formData = new FormData(event.currentTarget);
    const formDataStrings: Record<string, string> = {};
    const postData: Record<string, string | boolean | number> = {};
  
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        formDataStrings[key] = value; // Assign string values directly
      } else {
        console.warn(`Skipping non-string value for key: ${key}`);
      }
    });
  
    // TODO: we need these separately
    // Add the selected reason(s) to the data
    formDataStrings['reasonForIVF'] = selectedReason.join(',');
  
    // Combine height fields
    formDataStrings['height'] = (
      parseInt(formDataStrings['height-feet'] || '0') * 12 +
      parseInt(formDataStrings['height-inches'] || '0')
    ).toString();

    // Prepare the data for submission, following simplified logic for this demo app
    postData['isUsingOwnEggs'] = formDataStrings['isUsingOwnEggs'] === 'own-eggs';
    postData['hasPriorIVF'] = parseInt(formDataStrings['numPriorIVF']) > 0 ? true : false;
    postData['numPriorPregnancies'] = parseInt(formDataStrings['numPriorPregnancies']);
    postData['numPriorBirths'] = parseInt(formDataStrings['numPriorBirths']);
    postData['age'] = parseInt(formDataStrings['age']);
    postData['height'] = parseInt(formDataStrings['height']);
    postData['weight'] = parseInt(formDataStrings['weight']);
    postData['reasonForIVF'] = formDataStrings['reasonForIVF'];
    postData['isInfertilityReasonKnown'] = selectedReason.length > 0;
  
    setIsLoading(true);
    console.log('Form data:', formDataStrings);
    console.log('Post data:', postData);
  
    setTimeout(() => {
      console.log('Simulating a delay...');
      axios
        .post('/api/calculate-success-rate', JSON.stringify(postData))
        .then((response) => {
          console.log('Success rate:', response.data.successRate);
          // clearForm();
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

  // Manage checkboxes for Infertility reasons
  const clearKnownInfertilityReasons = () => {
    setSelectedTubalFactor(false);
    setSelectedMaleInfertility(false);
    setSelectedEndometriosis(false);
    setSelectedOvulatoryDisorder(false);
    setSelectedDiminishedReserve(false);
    setSelectedUterineFactor(false);
    setSelectedOtherReason(false);
  };

  const toggleInfertilityReason = (isChecked: boolean, setStateMethod: (isChecked: boolean)=>void) => {
    if (isChecked) {
      setStateMethod(true);
      setSelectedUnexplainedReason(false);
      setSelectedUnknownReason(false);
    } else {
      setStateMethod(false);
    }
  }

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

            <Select name="numPriorIVF" isRequired>
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

            <Select name="numPriorPregnancies" isRequired>
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
            
            <Select name="numPriorBirths" isRequired>
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

            <CheckboxGroup name="reasonForIVF" isRequired>
              <Label>What is the reason for your IVF treatment?</Label>
              <Group>
                <FormCheckbox
                  value="tubal-factor"
                  isSelected={selectedTubalFactor}
                  onChange={(isSelected) => toggleInfertilityReason(isSelected, setSelectedTubalFactor)}
                >
                  <Label>Tubal Factor</Label>
                </FormCheckbox>
                <FormCheckbox
                  value="male-factor-infertility"
                  isSelected={selectedMaleInfertility}
                  onChange={(isSelected) => toggleInfertilityReason(isSelected, setSelectedMaleInfertility)}
                >
                  <Label>Male Factor Infertility</Label>
                </FormCheckbox>
                <FormCheckbox
                  value="endometriosis"
                  isSelected={selectedEndometriosis}
                  onChange={(isSelected) => toggleInfertilityReason(isSelected, setSelectedEndometriosis)}
                >
                  <Label>Endometriosis</Label>
                </FormCheckbox>
                <FormCheckbox
                  value="ovulatory-disorder"
                  isSelected={selectedOvulatoryDisorder}
                  onChange={(isSelected) => toggleInfertilityReason(isSelected, setSelectedOvulatoryDisorder)}
                >
                  <Label>Ovulatory Disorder</Label>
                </FormCheckbox>
                <FormCheckbox
                  value="diminished-ovarian-reserve"
                  isSelected={selectedDiminishedReserve}
                  onChange={(isSelected) => toggleInfertilityReason(isSelected, setSelectedDiminishedReserve)}
                >
                  <Label>Diminished Ovarian Reserve</Label>
                </FormCheckbox>
                <FormCheckbox
                  value="uterine-factor"
                  isSelected={selectedUterineFactor}
                  onChange={(isSelected) => toggleInfertilityReason(isSelected, setSelectedUterineFactor)}
                >
                  <Label>Uterine Factor</Label>
                </FormCheckbox>
                <FormCheckbox
                  value="other"
                  isSelected={selectedOtherReason}
                  onChange={(isSelected) => toggleInfertilityReason(isSelected, setSelectedOtherReason)}
                >
                  <Label>Other Reason</Label>
                </FormCheckbox>
                <div>(OR)</div>
                <FormCheckbox
                  value="unexplained"
                  isSelected={selectedUnexplainedReason}
                  onChange={(isChecked) => {
                    if (isChecked) {
                      clearKnownInfertilityReasons();
                      setSelectedUnknownReason(false);
                      setSelectedUnexplainedReason(true);
                    } else {
                      setSelectedUnexplainedReason(false);
                    }
                  }}
                >
                  <Label>Unexplained (Idiopathic) infertility</Label>
                </FormCheckbox>
                <div>(OR)</div>
                <FormCheckbox
                  value="no-reason"
                  isSelected={selectedUnknownReason}
                  onChange={(isChecked) => {
                    if (isChecked) {
                      clearKnownInfertilityReasons();
                      setSelectedUnexplainedReason(false);
                      setSelectedUnknownReason(true);
                    } else {
                      setSelectedUnknownReason(false);
                    }
                  }}
                >
                  <Label>I don’t know/no reason</Label>
                </FormCheckbox>
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
