export type documentsTypes = {
  id: string;
  title: string;
  url: string;
  type?: string;
  period?: string;
  subject: {
    name: string;
    course: {
      name: string;
      school: {
        logo: string;
        acronime: string;
      };
    };
  };
};
