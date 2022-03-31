export interface Negocio {
    id: string;
    third_party: {
      first_name: string;
      first_surname: string;
      social_reason: string;
    };
    name: string;
    date: string;
    status: string;
    business_budget: [
      {
        budget: {
          total_cop: number
        }
      }
    ]
    presupuesto: number
}
