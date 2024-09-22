export type TaskDTO = {
  title: string;
  description: string;
  delivery: string;
};

export type Status = 'Pending' | 'Progres' | 'Declined' | 'Done';
