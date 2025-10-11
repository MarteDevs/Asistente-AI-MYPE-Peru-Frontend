// Reglas tributarias basadas dinámicamente en documento_consolidado_mypes.md
import { consolidatedConfig } from './mdConfig.js'

export const UIT_2025 = consolidatedConfig.uit

const NRUS = consolidatedConfig.regimes.nrus
const RER = consolidatedConfig.regimes.rer
const RMT = consolidatedConfig.regimes.rmt
const RG = consolidatedConfig.regimes.rg

/**
 * Construye una recomendación de régimen tributario basada en ingreso mensual
 * y reglas del documento consolidado.
 * @param {number|string} monthlyIncomeRaw
 * @returns {Object} Recomendación con detalles para la UI
 */
export function buildRecommendationFromIncome(monthlyIncomeRaw) {
  const monthlyIncome = Number(monthlyIncomeRaw || 0)
  const annualIncome = monthlyIncome * 12
  const toSoles = (uit) => uit * UIT_2025

  let regime = 'Régimen General'
  let description = 'Sin límites de ingresos; contabilidad completa.'
  let monthlyTax = monthlyIncome * 0.20 * RG.irAnnualRate // estimación: 20% utilidad anual * tasa IR
  let taxType = `${(RG.irAnnualRate * 100).toFixed(1)}% sobre utilidad (estimada 20%)`
  let igvIncluded = false
  let igvApplicable = true
  let igvRate = undefined
  let monthlyRateApplied = undefined
  let annualRegRateApplied = undefined
  let quotaCategory = undefined
  let benefits = [
    'Puede realizar cualquier actividad económica',
    'Puede emitir todo tipo de comprobantes',
    'Pérdidas pueden compensarse con utilidades futuras'
  ]
  let requirements = [
    'Llevar contabilidad completa',
    'Libros electrónicos, balances y estados financieros',
    'Declaración anual con tasa 29.5% sobre utilidad neta'
  ]

  if (monthlyIncome <= NRUS.monthlyIncomeMax) {
    // NRUS
    regime = 'Nuevo RUS'
    description = `Personas naturales con pequeños negocios y consumidores finales. Ingresos hasta S/ ${NRUS.monthlyIncomeMax.toLocaleString('es-PE')} mensuales.`
    monthlyTax = monthlyIncome <= NRUS.quotas.category1.max ? NRUS.quotas.category1.amount : NRUS.quotas.category2.amount
    taxType = 'Cuota fija mensual (Categorías 1 y 2)'
    igvApplicable = false
    quotaCategory = monthlyIncome <= NRUS.quotas.category1.max ? 'Categoría 1' : 'Categoría 2'
    benefits = [
      'No lleva registros contables',
      'Pago mensual único (cuota fija)',
      'Sin declaración anual',
      'Acceso al SIS Emprendedor'
    ]
    requirements = [
      'Emitir boletas/tickets y guías de remisión',
      'No otorga crédito fiscal',
      'Respetar límites de ingresos y compras (S/ 8,000 mensuales)'
    ]
  } else if (annualIncome <= RER.annualIncomeMax) {
    // RER
    regime = 'RER'
    description = `Pequeñas empresas con límites de ingresos hasta S/ ${RER.annualIncomeMax.toLocaleString('es-PE')} anuales. Lleva Registro de Compras y Ventas.`
    monthlyTax = monthlyIncome * RER.irMonthlyRate
    taxType = `${(RER.irMonthlyRate * 100).toFixed(1)}% de ingresos netos mensuales (IR)`
    igvApplicable = true
    igvRate = RER.igvRate
    monthlyRateApplied = RER.irMonthlyRate
    benefits = [
      'Solo dos registros: Compras y Ventas',
      'Declaraciones mensuales',
      'Puede emitir cualquier comprobante'
    ]
    requirements = [
      'Mantener registros de Compras y Ventas',
      'Presentar declaraciones mensuales',
      'Actividades permitidas: comercialización de bienes o servicios'
    ]
  } else if (annualIncome <= RMT.annualIncomeMaxSoles) {
    // RMT
    regime = 'Régimen MYPE Tributario'
    description = `Micro y pequeñas empresas con rentas de Tercera Categoría, hasta ${RMT.annualIncomeMaxUIT} UIT anuales.`
    const annualThreshold300Soles = toSoles(RMT.thresholdsUIT.lower)
    const annualThreshold15Soles = toSoles(15)
    const isLowerBand = annualIncome <= annualThreshold300Soles
    monthlyTax = isLowerBand ? (monthlyIncome * RMT.monthlyRateLower) : (monthlyIncome * RMT.monthlyRateHigher)
    monthlyRateApplied = isLowerBand ? RMT.monthlyRateLower : RMT.monthlyRateHigher
    taxType = `${(RMT.monthlyRateLower * 100).toFixed(1)}% (≤${RMT.thresholdsUIT.lower} UIT anuales) o ${(RMT.monthlyRateHigher * 100).toFixed(1)}% (>${RMT.thresholdsUIT.lower} UIT) de ingresos mensuales`
    igvApplicable = true
    igvRate = RMT.igvRate
    annualRegRateApplied = annualIncome <= annualThreshold15Soles ? RMT.annualRegLowRate : RMT.annualRegHighRate
    benefits = [
      'Impuesto según ganancia obtenida',
      'Puede emitir cualquier comprobante',
      'Puede realizar cualquier actividad económica',
      'Contabilidad sencilla según nivel de ingresos'
    ]
    requirements = [
      'Registros: Ventas, Compras y Libro Diario simplificado (según ingresos)',
      'Agregar Libro Diario y Mayor si >300 UIT; Inventarios y Balances si >500 UIT',
      'Declaraciones mensuales y regularización anual'
    ]
  }

  return {
    regime,
    description,
    monthlyTax,
    monthlyIncome,
    annualIncome,
    taxType,
    igvIncluded,
    igvApplicable,
    igvRate,
    monthlyRateApplied,
    annualRegRateApplied,
    quotaCategory,
    benefits,
    requirements
  }
}