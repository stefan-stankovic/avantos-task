import { Dependency } from '@/features/action-graph/api/types';
import { create } from 'zustand';

export interface FieldMapping {
  sourceFormId: string;
  sourceFormName: string;
  sourceFieldName: string;
}

export interface GlobalDataSource {
  id: string;
  name: string;
  fields: string[];
}

export const GLOBAL_DATA_SOURCES: GlobalDataSource[] = [
  {
    id: 'action-properties',
    name: 'Action Properties',
    fields: [
      'action_id',
      'action_name',
      'action_type',
      'created_at',
      'created_by',
      'status',
    ],
  },
  {
    id: 'client-organization',
    name: 'Client Organization Properties',
    fields: [
      'organization_id',
      'organization_name',
      'organization_type',
      'country',
      'industry',
      'size',
    ],
  },
];

export interface FormFieldState {
  fieldName: string;
  value: string | null;
  prefillMapping: FieldMapping | null;
}

export interface FormState {
  nodeId: string;
  formId: string;
  formName: string;
  fields: Record<string, FormFieldState>; // key = fieldName
}

export interface SelectedNodeData {
  nodeId: string;
  formId: string;
  formName: string;
  formFields: string[];
  dependencies: {
    direct: Dependency[];
    transitive: Dependency[];
  };
}

export interface FieldMappingModalData {
  nodeId: string;
  formId: string;
  fieldName: string;
  currentMapping: FieldMapping | null;
  availableDependencies: Dependency[];
}

interface FormStateStore {
  formStates: Record<string, FormState>; // key = nodeId

  selectedNode: SelectedNodeData | null;

  fieldMappingModal: FieldMappingModalData | null;

  initializeFormState: (
    nodeId: string,
    formId: string,
    formName: string,
    formFields: string[]
  ) => void;

  setFieldValue: (nodeId: string, fieldName: string, value: string) => void;

  setFieldMapping: (
    nodeId: string,
    fieldName: string,
    mapping: FieldMapping | null
  ) => void;

  openNodeModal: (nodeData: SelectedNodeData) => void;
  closeNodeModal: () => void;

  openFieldMappingModal: (data: FieldMappingModalData) => void;
  closeFieldMappingModal: () => void;

  getFormState: (nodeId: string) => FormState | null;
  getFieldState: (nodeId: string, fieldName: string) => FormFieldState | null;
}

export const useFormStateStore = create<FormStateStore>((set, get) => ({
  formStates: {},
  selectedNode: null,
  fieldMappingModal: null,

  initializeFormState: (nodeId, formId, formName, formFields) => {
    const existingState = get().formStates[nodeId];
    if (existingState) return;

    const fields: Record<string, FormFieldState> = {};
    formFields.forEach((fieldName) => {
      fields[fieldName] = {
        fieldName,
        value: null,
        prefillMapping: null,
      };
    });

    set((state) => ({
      formStates: {
        ...state.formStates,
        [nodeId]: {
          nodeId,
          formId,
          formName,
          fields,
        },
      },
    }));
  },

  setFieldValue: (nodeId, fieldName, value) => {
    set((state) => {
      const formState = state.formStates[nodeId];
      if (!formState) return state;

      return {
        formStates: {
          ...state.formStates,
          [nodeId]: {
            ...formState,
            fields: {
              ...formState.fields,
              [fieldName]: {
                ...formState.fields[fieldName],
                value,
              },
            },
          },
        },
      };
    });
  },

  setFieldMapping: (nodeId, fieldName, mapping) => {
    set((state) => {
      const formState = state.formStates[nodeId];
      if (!formState) return state;

      return {
        formStates: {
          ...state.formStates,
          [nodeId]: {
            ...formState,
            fields: {
              ...formState.fields,
              [fieldName]: {
                ...formState.fields[fieldName],
                prefillMapping: mapping,
              },
            },
          },
        },
      };
    });
  },

  openNodeModal: (nodeData) => {
    const formState = get().formStates[nodeData.nodeId];
    if (!formState) {
      get().initializeFormState(
        nodeData.nodeId,
        nodeData.formId,
        nodeData.formName,
        nodeData.formFields
      );
    }
    set({ selectedNode: nodeData });
  },

  closeNodeModal: () => {
    set({ selectedNode: null });
  },

  openFieldMappingModal: (data) => {
    set({ fieldMappingModal: data });
  },

  closeFieldMappingModal: () => {
    set({ fieldMappingModal: null });
  },

  getFormState: (nodeId) => {
    return get().formStates[nodeId] || null;
  },

  getFieldState: (nodeId, fieldName) => {
    const formState = get().formStates[nodeId];
    if (!formState) return null;
    return formState.fields[fieldName] || null;
  },
}));
