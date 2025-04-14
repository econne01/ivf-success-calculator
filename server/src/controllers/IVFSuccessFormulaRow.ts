/**
 * These types represent the structure of the incoming POST request
 */
export type FormulaSelectionParams = {
    isUsingOwnEggs: true;
    hasPriorIVF: boolean; // Required when isUsingOwnEggs is true
    isInfertilityReasonKnown: boolean;
} |
{
    isUsingOwnEggs: false;
    isInfertilityReasonKnown: boolean;
};

export type FormulaCalculationParams = {
    age: number;
    height: number; // in inches, from 4'6" to 6'0", aka 54" to 72"
    weight: number; // in lbs, from 80 to 300
    numPriorPregnancies: number; // 0 to 2. Any more than 2 is counted the same as 2
    numPriorBirths: number; // 0 to 2. Any more than 2 is counted the same as 2
};

export type InfertilityReasonParams = {
    tubal_factor: boolean;
    male_factor_infertility: boolean;
    endometriosis: boolean;
    ovulatory_disorder: boolean;
    diminished_ovarian_reserve: boolean;
    uterine_factor: boolean;
    other_reason: boolean;
    unexplained_infertility: boolean;
};

export type IVFSuccessCalculationRequest = FormulaSelectionParams & FormulaCalculationParams & InfertilityReasonParams;

/**
 * These types represent the structure of the CSV file with calculation formulas
 */
type Integer = number & { __integer: true; }; // create a custom type to represent integers
export type IVFFormulaInfertilityScores = {
    // scores for the infertility reasons
    formula_tubal_factor_true_value: number;
    formula_tubal_factor_false_value: Integer;
    formula_male_factor_infertility_true_value: number;
    formula_male_factor_infertility_false_value: Integer;
    formula_endometriosis_true_value: number;
    formula_endometriosis_false_value: Integer;
    formula_ovulatory_disorder_true_value: number;
    formula_ovulatory_disorder_false_value: Integer;
    formula_diminished_ovarian_reserve_true_value: number;
    formula_diminished_ovarian_reserve_false_value: Integer;
    formula_uterine_factor_true_value: number;
    formula_uterine_factor_false_value: Integer;
    formula_other_reason_true_value: number;
    formula_other_reason_false_value: Integer;
    formula_unexplained_infertility_true_value: number;
    formula_unexplained_infertility_false_value: Integer;
};

export type IVFFormulaPriorScores = {
    // scores for the number of prior pregnancies
    formula_prior_pregnancies_0_value: Integer;
    formula_prior_pregnancies_1_value: number;
    'formula_prior_pregnancies_2+_value': number;
    // scores for the number of prior births
    formula_prior_live_births_0_value: Integer;
    formula_prior_live_births_1_value: number;
    'formula_prior_live_births_2+_value': number;
};

// This type defines the structure of the data in the CSV file
export type IVFSuccessFormulaRow = {
    // Parameters for finding the relevant formula
    param_using_own_eggs: boolean;
    param_attempted_ivf_previously: boolean;
    param_is_reason_for_infertility_known: boolean;
    cdc_formula: string;
    // calculation params for Age & BMI score
    formula_intercept: number;
    formula_age_linear_coefficient: number;
    formula_age_power_coefficient: number;
    formula_age_power_factor: number;
    formula_bmi_linear_coefficient: number;
    formula_bmi_power_coefficient: number;
    formula_bmi_power_factor: Integer;
} & IVFFormulaInfertilityScores & IVFFormulaPriorScores;
