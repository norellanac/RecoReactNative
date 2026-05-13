import { useTranslation } from 'react-i18next';
import { useBranding } from './useBranding';
import { FieldLabels, LabelSet } from '../types/branding';

const DEFAULT: FieldLabels = {
  preset: 'services_marketplace',
  productService: {
    entityName:       { en: 'Service',       es: 'Servicio' },
    entityNamePlural: { en: 'Services',      es: 'Servicios' },
    name:             { en: 'Service name',  es: 'Nombre del servicio' },
    description:      { en: 'Description',   es: 'Descripción' },
    price:            { en: 'Price',          es: 'Precio' },
    specialPrice:     { en: 'Special price', es: 'Precio especial' },
    location:         { en: 'Location',       es: 'Ubicación' },
    provider:         { en: 'Professional',  es: 'Profesional' },
    providerPlural:   { en: 'Professionals', es: 'Profesionales' },
    details:          { en: 'Details',        es: 'Detalles' },
    serviceAreas:     { en: 'Service areas', es: 'Áreas de servicio' },
    rating:           { en: 'Rating',         es: 'Calificación' },
  },
  order: {
    entityName:       { en: 'Order',        es: 'Orden' },
    entityNamePlural: { en: 'Orders',       es: 'Órdenes' },
    totalAmount:      { en: 'Total',        es: 'Total' },
    startDate:        { en: 'Start date',   es: 'Fecha de inicio' },
    endDate:          { en: 'End date',     es: 'Fecha de fin' },
    comment:          { en: 'Notes',        es: 'Notas' },
    quantity:         { en: 'Quantity',     es: 'Cantidad' },
    unitPrice:        { en: 'Unit price',   es: 'Precio unitario' },
    discount:         { en: 'Discount',     es: 'Descuento' },
    charge:           { en: 'Extra charge', es: 'Cargo extra' },
    actions: {
      create:  { en: 'Book service',  es: 'Contratar servicio' },
      cancel:  { en: 'Cancel',        es: 'Cancelar' },
      confirm: { en: 'Confirm',       es: 'Confirmar' },
    },
    statuses: {
      pending:    { en: 'Pending',     es: 'Pendiente' },
      confirmed:  { en: 'Confirmed',   es: 'Confirmada' },
      inProgress: { en: 'In progress', es: 'En progreso' },
      completed:  { en: 'Completed',   es: 'Completada' },
      cancelled:  { en: 'Cancelled',   es: 'Cancelada' },
    },
  },
};

const pick = (set: LabelSet, lang: string): string =>
  lang.startsWith('es') ? set.es : set.en;

const resolveSection = (section: Record<string, any>, lang: string): Record<string, any> =>
  Object.fromEntries(
    Object.entries(section).map(([k, v]) => {
      if (v && typeof v === 'object' && 'en' in v && 'es' in v) return [k, pick(v as LabelSet, lang)];
      if (v && typeof v === 'object') return [k, resolveSection(v, lang)];
      return [k, v];
    })
  );

export const useLabels = () => {
  const { i18n } = useTranslation();
  const { config } = useBranding();
  const lang = i18n.language || 'es';
  const raw = config?.fieldLabels ?? DEFAULT;

  return {
    productService: resolveSection(raw.productService, lang) as Record<string, string>,
    order: resolveSection(raw.order, lang) as Record<string, any>,
    preset: raw.preset,
  };
};
