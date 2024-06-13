import { create } from 'zustand';

const useStore = create((set: any) => ({
  name: '',
  setName: (newName: any) => set({ name: newName }),

  showEducationForm: false,
  setShowEducationForm: (newShowEducationForm: boolean) =>
    set({ showEducationForm: newShowEducationForm }),

  showUpdateForm: false,
  setShowUpdateForm: (newShowUpdateForm: boolean) =>
    set({ showUpdateForm: newShowUpdateForm }),

  showWorkExperienceForm: false,
  setShowWorkExperienceForm: (newShowWorkExperienceForm: boolean) =>
    set({ showWorkExperienceForm: newShowWorkExperienceForm }),

  editingExperienceId: null,
  setEditingExperienceId: (id: string | null) =>
    set({ editingExperienceId: id }),
  editingEducationId: null,
  setEditingEducationId: (id: string | null) => set({ editingEducationId: id }),

  experiences: [],
  addExperience: (experience: any) =>
    set((state: any) => ({
      experiences: [...state.experiences, experience],
    })),
  updateExperience: (newExperience: any) =>
    set((state: any) => {
      const updatedExperiences = state.experiences.map((experience: any) =>
        experience.id === newExperience.id ? newExperience : experience,
      );
      return { experiences: updatedExperiences };
    }),

  education: [],
  addEducation: (education: any) =>
    set((state: any) => ({
      education: [...state.education, education],
    })),
  updateEducation: (newEducation: any) =>
    set((state: any) => {
      const updatedEducation = state.education.map((education: any) =>
        education.id === newEducation.id ? newEducation : education,
      );
      return { education: updatedEducation };
    }),
}));

export default useStore;
