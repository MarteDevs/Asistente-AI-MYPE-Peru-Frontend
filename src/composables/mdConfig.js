// Parser simple para extraer configuración clave desde documento_consolidado_mypes.md
// Utiliza importación cruda del Markdown para obtener el texto y aplicar regex.

import mdRaw from '../../documento_consolidado_mypes.md?raw'

function toNumber(str) {
  if (!str) return NaN
  return Number(String(str).replace(/[^\d.]/g, ''))
}

function parseUIT(markdown) {
  const uitMatch = markdown.match(/\*\*UIT\s*2025:\*\*\s*S\/\s*([\d.,]+)/i)
  const uit = uitMatch ? toNumber(uitMatch[1]) : 5350

  // Conversiones en la sección UIT
  const conversions = {}
  const convRegex = /-\s*(\d{1,4})\s*UIT\s*=\s*S\/\s*([\d.,]+)/gi
  let m
  while ((m = convRegex.exec(markdown)) !== null) {
    const uitCount = Number(m[1])
    conversions[uitCount] = toNumber(m[2])
  }
  return { uit, conversions }
}

function parseNRUS(markdown) {
  // Límites
  const limitIncomeMonthly = /Ingresos\s+m[aá]ximos:\s*S\/\s*([\d.,]+)\s+anuales\s+o\s+S\/\s*([\d.,]+)\s+mensuales/i.exec(markdown)
  const monthlyMax = limitIncomeMonthly ? toNumber(limitIncomeMonthly[2]) : 8000
  const assetMaxMatch = /Activos\s+fijos\s+m[aá]ximos:\s*S\/\s*([\d.,]+)/i.exec(markdown)
  const assetMax = assetMaxMatch ? toNumber(assetMaxMatch[1]) : 70000
  // Cuotas
  const cat1Match = /Categor[ií]a\s*1\s*\(hasta\s*S\/\s*([\d.,]+)\):\s*S\/\s*([\d.,]+)/i.exec(markdown)
  const cat2Match = /Categor[ií]a\s*2\s*\(hasta\s*S\/\s*([\d.,]+)\):\s*S\/\s*([\d.,]+)/i.exec(markdown)
  const catEspMatch = /Categor[ií]a\s*especial\s*\(productos\s+agr[ií]colas\s+hasta\s*S\/\s*([\d.,]+)\):\s*S\/\s*([\d.,]+)/i.exec(markdown)

  return {
    monthlyIncomeMax: monthlyMax,
    monthlyPurchasesMax: monthlyMax,
    assetMax,
    quotas: {
      category1: { max: cat1Match ? toNumber(cat1Match[1]) : 5000, amount: cat1Match ? toNumber(cat1Match[2]) : 20 },
      category2: { max: cat2Match ? toNumber(cat2Match[1]) : 8000, amount: cat2Match ? toNumber(cat2Match[2]) : 50 },
      specialAgricola: { maxAnnual: catEspMatch ? toNumber(catEspMatch[1]) : 60000, amount: catEspMatch ? toNumber(catEspMatch[2]) : 0 }
    }
  }
}

function parseRER(markdown) {
  const annualIncomeMaxMatch = /Ingresos\s+netos\s+anuales:\s*m[aá]ximo\s*S\/\s*([\d.,]+)/i.exec(markdown)
  const annualPurchasesMaxMatch = /Compras\s+anuales:\s*m[aá]ximo\s*S\/\s*([\d.,]+)/i.exec(markdown)
  const assetMaxMatch = /Activos\s+fijos:\s*m[aá]ximo\s*S\/\s*([\d.,]+)/i.exec(markdown)
  const workersMaxMatch = /Trabajadores:\s*m[aá]ximo\s*(\d+)/i.exec(markdown)
  const irRateMatch = /Impuesto\s+a\s+la\s+Renta:\s*([\d.,]+)%\s*sobre\s+ingresos\s+netos\s+mensuales/i.exec(markdown)
  const igvRateMatch = /IGV:\s*([\d.,]+)%/i.exec(markdown)

  return {
    annualIncomeMax: annualIncomeMaxMatch ? toNumber(annualIncomeMaxMatch[1]) : 525000,
    annualPurchasesMax: annualPurchasesMaxMatch ? toNumber(annualPurchasesMaxMatch[1]) : 525000,
    assetMax: assetMaxMatch ? toNumber(assetMaxMatch[1]) : 126000,
    workersPerShiftMax: workersMaxMatch ? Number(workersMaxMatch[1]) : 10,
    irMonthlyRate: irRateMatch ? toNumber(irRateMatch[1]) / 100 : 0.015,
    igvRate: igvRateMatch ? toNumber(igvRateMatch[1]) / 100 : 0.18
  }
}

function parseRMT(markdown, uit) {
  const annualMaxMatch = /Ingresos\s+netos:\s*m[aá]ximo\s*1,?700\s*UIT/i.exec(markdown)
  const monthlyRateLowerMatch = /ingresos\s*≤\s*300\s*UIT:\s*([\d.,]+)%/i.exec(markdown)
  const monthlyRateHigherMatch = /ingresos\s*>\s*300\s*UIT:\s*([\d.,]+)%\s*o\s*coeficiente/i.exec(markdown)
  const igvRateMatch = /IGV:\s*([\d.,]+)%/i.exec(markdown)
  const annualRegLowMatch = /Hasta\s*15\s*UIT:\s*([\d.,]+)%/i.exec(markdown)
  const annualRegHighMatch = /M[aá]s\s*de\s*15\s*UIT:\s*([\d.,]+)%/i.exec(markdown)

  return {
    annualIncomeMaxUIT: annualMaxMatch ? 1700 : 1700,
    annualIncomeMaxSoles: uit * 1700,
    monthlyRateLower: monthlyRateLowerMatch ? toNumber(monthlyRateLowerMatch[1]) / 100 : 0.01,
    monthlyRateHigher: monthlyRateHigherMatch ? toNumber(monthlyRateHigherMatch[1]) / 100 : 0.015,
    igvRate: igvRateMatch ? toNumber(igvRateMatch[1]) / 100 : 0.18,
    annualRegLowRate: annualRegLowMatch ? toNumber(annualRegLowMatch[1]) / 100 : 0.10,
    annualRegHighRate: annualRegHighMatch ? toNumber(annualRegHighMatch[1]) / 100 : 0.295,
    thresholdsUIT: { lower: 300, mid: 500, max: 1700 }
  }
}

function parseRG(markdown) {
  const irAnnualMatch = /tasa\s*de\s*([\d.,]+)%\s*sobre\s*utilidad\s*neta/i.exec(markdown)
  const irRate = irAnnualMatch ? toNumber(irAnnualMatch[1]) / 100 : 0.295
  return { irAnnualRate: irRate }
}

export function parseConsolidatedMarkdown(markdown = mdRaw) {
  const { uit, conversions } = parseUIT(markdown)
  const nrus = parseNRUS(markdown)
  const rer = parseRER(markdown)
  const rmt = parseRMT(markdown, uit)
  const rg = parseRG(markdown)

  return {
    uit,
    conversions,
    regimes: { nrus, rer, rmt, rg }
  }
}

export const consolidatedConfig = parseConsolidatedMarkdown(mdRaw)