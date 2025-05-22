import { F as Faker, L as LocaleDefinition, R as Randomizer } from './airline-C5Qwd7_q.js';
export { r as Aircraft, s as AircraftType, A as AirlineDefinition, t as AirlineModule, a as AnimalDefinition, u as AnimalModule, Z as BitcoinAddressFamily, $ as BitcoinAddressFamilyType, _ as BitcoinNetwork, a0 as BitcoinNetworkType, x as Casing, ag as ChemicalElement, C as ColorDefinition, y as ColorFormat, z as ColorModule, b as CommerceDefinition, J as CommerceModule, c as CommerceProductNameDefinition, d as CompanyDefinition, K as CompanyModule, v as CssFunction, B as CssFunctionType, w as CssSpace, E as CssSpaceType, X as Currency, D as DatabaseDefinition, O as DatabaseModule, Q as DatatypeModule, e as DateDefinition, f as DateEntryDefinition, T as DateModule, q as FakerOptions, g as FinanceDefinition, Y as FinanceModule, h as FoodDefinition, a1 as FoodModule, a2 as GitModule, H as HackerDefinition, a3 as HackerModule, a4 as HelpersModule, a6 as ImageModule, I as InternetDefinition, a7 as InternetModule, i as LocaleEntry, j as LocationDefinition, a8 as LocationModule, k as LoremDefinition, a9 as LoremModule, M as MetadataDefinition, l as MusicDefinition, aa as MusicModule, N as NumberColorFormat, ab as NumberModule, P as PersonDefinition, m as PersonEntryDefinition, ad as PersonModule, af as PhoneModule, n as PhoneNumberDefinition, S as ScienceDefinition, ah as ScienceModule, ac as Sex, ae as SexType, U as SimpleDateModule, an as SimpleFaker, a5 as SimpleHelpersModule, G as StringColorFormat, aj as StringModule, o as SystemDefinition, p as SystemMimeTypeEntryDefinition, ak as SystemModule, ai as Unit, V as VehicleDefinition, al as VehicleModule, W as WordDefinition, am as WordModule, ao as simpleFaker } from './airline-C5Qwd7_q.js';
export { faker, faker as fakerEN } from './locale/en.js';
export { faker as fakerAF_ZA } from './locale/af_ZA.js';
export { faker as fakerAR } from './locale/ar.js';
export { faker as fakerAZ } from './locale/az.js';
export { faker as fakerBASE } from './locale/base.js';
export { faker as fakerCS_CZ } from './locale/cs_CZ.js';
export { faker as fakerDA } from './locale/da.js';
export { faker as fakerDE } from './locale/de.js';
export { faker as fakerDE_AT } from './locale/de_AT.js';
export { faker as fakerDE_CH } from './locale/de_CH.js';
export { faker as fakerDV } from './locale/dv.js';
export { faker as fakerEL } from './locale/el.js';
export { faker as fakerEN_AU } from './locale/en_AU.js';
export { faker as fakerEN_AU_ocker } from './locale/en_AU_ocker.js';
export { faker as fakerEN_BORK } from './locale/en_BORK.js';
export { faker as fakerEN_CA } from './locale/en_CA.js';
export { faker as fakerEN_GB } from './locale/en_GB.js';
export { faker as fakerEN_GH } from './locale/en_GH.js';
export { faker as fakerEN_HK } from './locale/en_HK.js';
export { faker as fakerEN_IE } from './locale/en_IE.js';
export { faker as fakerEN_IN } from './locale/en_IN.js';
export { faker as fakerEN_NG } from './locale/en_NG.js';
export { faker as fakerEN_US } from './locale/en_US.js';
export { faker as fakerEN_ZA } from './locale/en_ZA.js';
export { faker as fakerEO } from './locale/eo.js';
export { faker as fakerES } from './locale/es.js';
export { faker as fakerES_MX } from './locale/es_MX.js';
export { faker as fakerFA } from './locale/fa.js';
export { faker as fakerFI } from './locale/fi.js';
export { faker as fakerFR } from './locale/fr.js';
export { faker as fakerFR_BE } from './locale/fr_BE.js';
export { faker as fakerFR_CA } from './locale/fr_CA.js';
export { faker as fakerFR_CH } from './locale/fr_CH.js';
export { faker as fakerFR_LU } from './locale/fr_LU.js';
export { faker as fakerFR_SN } from './locale/fr_SN.js';
export { faker as fakerHE } from './locale/he.js';
export { faker as fakerHR } from './locale/hr.js';
export { faker as fakerHU } from './locale/hu.js';
export { faker as fakerHY } from './locale/hy.js';
export { faker as fakerID_ID } from './locale/id_ID.js';
export { faker as fakerIT } from './locale/it.js';
export { faker as fakerJA } from './locale/ja.js';
export { faker as fakerKA_GE } from './locale/ka_GE.js';
export { faker as fakerKO } from './locale/ko.js';
export { faker as fakerLV } from './locale/lv.js';
export { faker as fakerMK } from './locale/mk.js';
export { faker as fakerNB_NO } from './locale/nb_NO.js';
export { faker as fakerNE } from './locale/ne.js';
export { faker as fakerNL } from './locale/nl.js';
export { faker as fakerNL_BE } from './locale/nl_BE.js';
export { faker as fakerPL } from './locale/pl.js';
export { faker as fakerPT_BR } from './locale/pt_BR.js';
export { faker as fakerPT_PT } from './locale/pt_PT.js';
export { faker as fakerRO } from './locale/ro.js';
export { faker as fakerRO_MD } from './locale/ro_MD.js';
export { faker as fakerRU } from './locale/ru.js';
export { faker as fakerSK } from './locale/sk.js';
export { faker as fakerSR_RS_latin } from './locale/sr_RS_latin.js';
export { faker as fakerSV } from './locale/sv.js';
export { faker as fakerTH } from './locale/th.js';
export { faker as fakerTR } from './locale/tr.js';
export { faker as fakerUK } from './locale/uk.js';
export { faker as fakerUR } from './locale/ur.js';
export { faker as fakerUZ_UZ_latin } from './locale/uz_UZ_latin.js';
export { faker as fakerVI } from './locale/vi.js';
export { faker as fakerYO_NG } from './locale/yo_NG.js';
export { faker as fakerZH_CN } from './locale/zh_CN.js';
export { faker as fakerZH_TW } from './locale/zh_TW.js';
export { faker as fakerZU_ZA } from './locale/zu_ZA.js';

/**
 * An error instance that will be thrown by faker.
 */
declare class FakerError extends Error {
}

declare const allFakers: {
    readonly af_ZA: Faker;
    readonly ar: Faker;
    readonly az: Faker;
    readonly base: Faker;
    readonly cs_CZ: Faker;
    readonly da: Faker;
    readonly de: Faker;
    readonly de_AT: Faker;
    readonly de_CH: Faker;
    readonly dv: Faker;
    readonly el: Faker;
    readonly en: Faker;
    readonly en_AU: Faker;
    readonly en_AU_ocker: Faker;
    readonly en_BORK: Faker;
    readonly en_CA: Faker;
    readonly en_GB: Faker;
    readonly en_GH: Faker;
    readonly en_HK: Faker;
    readonly en_IE: Faker;
    readonly en_IN: Faker;
    readonly en_NG: Faker;
    readonly en_US: Faker;
    readonly en_ZA: Faker;
    readonly eo: Faker;
    readonly es: Faker;
    readonly es_MX: Faker;
    readonly fa: Faker;
    readonly fi: Faker;
    readonly fr: Faker;
    readonly fr_BE: Faker;
    readonly fr_CA: Faker;
    readonly fr_CH: Faker;
    readonly fr_LU: Faker;
    readonly fr_SN: Faker;
    readonly he: Faker;
    readonly hr: Faker;
    readonly hu: Faker;
    readonly hy: Faker;
    readonly id_ID: Faker;
    readonly it: Faker;
    readonly ja: Faker;
    readonly ka_GE: Faker;
    readonly ko: Faker;
    readonly lv: Faker;
    readonly mk: Faker;
    readonly nb_NO: Faker;
    readonly ne: Faker;
    readonly nl: Faker;
    readonly nl_BE: Faker;
    readonly pl: Faker;
    readonly pt_BR: Faker;
    readonly pt_PT: Faker;
    readonly ro: Faker;
    readonly ro_MD: Faker;
    readonly ru: Faker;
    readonly sk: Faker;
    readonly sr_RS_latin: Faker;
    readonly sv: Faker;
    readonly th: Faker;
    readonly tr: Faker;
    readonly uk: Faker;
    readonly ur: Faker;
    readonly uz_UZ_latin: Faker;
    readonly vi: Faker;
    readonly yo_NG: Faker;
    readonly zh_CN: Faker;
    readonly zh_TW: Faker;
    readonly zu_ZA: Faker;
};

declare const af_ZA: LocaleDefinition;

declare const ar: LocaleDefinition;

declare const az: LocaleDefinition;

declare const base: LocaleDefinition;

declare const cs_CZ: LocaleDefinition;

declare const da: LocaleDefinition;

declare const de: LocaleDefinition;

declare const de_AT: LocaleDefinition;

declare const de_CH: LocaleDefinition;

declare const dv: LocaleDefinition;

declare const el: LocaleDefinition;

declare const en: LocaleDefinition;

declare const en_AU: LocaleDefinition;

declare const en_AU_ocker: LocaleDefinition;

declare const en_BORK: LocaleDefinition;

declare const en_CA: LocaleDefinition;

declare const en_GB: LocaleDefinition;

declare const en_GH: LocaleDefinition;

declare const en_HK: LocaleDefinition;

declare const en_IE: LocaleDefinition;

declare const en_IN: LocaleDefinition;

declare const en_NG: LocaleDefinition;

declare const en_US: LocaleDefinition;

declare const en_ZA: LocaleDefinition;

declare const eo: LocaleDefinition;

declare const es: LocaleDefinition;

declare const es_MX: LocaleDefinition;

declare const fa: LocaleDefinition;

declare const fi: LocaleDefinition;

declare const fr: LocaleDefinition;

declare const fr_BE: LocaleDefinition;

declare const fr_CA: LocaleDefinition;

declare const fr_CH: LocaleDefinition;

declare const fr_LU: LocaleDefinition;

declare const fr_SN: LocaleDefinition;

declare const he: LocaleDefinition;

declare const hr: LocaleDefinition;

declare const hu: LocaleDefinition;

declare const hy: LocaleDefinition;

declare const id_ID: LocaleDefinition;

declare const it: LocaleDefinition;

declare const ja: LocaleDefinition;

declare const ka_GE: LocaleDefinition;

declare const ko: LocaleDefinition;

declare const lv: LocaleDefinition;

declare const mk: LocaleDefinition;

declare const nb_NO: LocaleDefinition;

declare const ne: LocaleDefinition;

declare const nl: LocaleDefinition;

declare const nl_BE: LocaleDefinition;

declare const pl: LocaleDefinition;

declare const pt_BR: LocaleDefinition;

declare const pt_PT: LocaleDefinition;

declare const ro: LocaleDefinition;

declare const ro_MD: LocaleDefinition;

declare const ru: LocaleDefinition;

declare const sk: LocaleDefinition;

declare const sr_RS_latin: LocaleDefinition;

declare const sv: LocaleDefinition;

declare const th: LocaleDefinition;

declare const tr: LocaleDefinition;

declare const uk: LocaleDefinition;

declare const ur: LocaleDefinition;

declare const uz_UZ_latin: LocaleDefinition;

declare const vi: LocaleDefinition;

declare const yo_NG: LocaleDefinition;

declare const zh_CN: LocaleDefinition;

declare const zh_TW: LocaleDefinition;

declare const zu_ZA: LocaleDefinition;

declare const allLocales: {
    af_ZA: LocaleDefinition;
    ar: LocaleDefinition;
    az: LocaleDefinition;
    base: LocaleDefinition;
    cs_CZ: LocaleDefinition;
    da: LocaleDefinition;
    de: LocaleDefinition;
    de_AT: LocaleDefinition;
    de_CH: LocaleDefinition;
    dv: LocaleDefinition;
    el: LocaleDefinition;
    en: LocaleDefinition;
    en_AU: LocaleDefinition;
    en_AU_ocker: LocaleDefinition;
    en_BORK: LocaleDefinition;
    en_CA: LocaleDefinition;
    en_GB: LocaleDefinition;
    en_GH: LocaleDefinition;
    en_HK: LocaleDefinition;
    en_IE: LocaleDefinition;
    en_IN: LocaleDefinition;
    en_NG: LocaleDefinition;
    en_US: LocaleDefinition;
    en_ZA: LocaleDefinition;
    eo: LocaleDefinition;
    es: LocaleDefinition;
    es_MX: LocaleDefinition;
    fa: LocaleDefinition;
    fi: LocaleDefinition;
    fr: LocaleDefinition;
    fr_BE: LocaleDefinition;
    fr_CA: LocaleDefinition;
    fr_CH: LocaleDefinition;
    fr_LU: LocaleDefinition;
    fr_SN: LocaleDefinition;
    he: LocaleDefinition;
    hr: LocaleDefinition;
    hu: LocaleDefinition;
    hy: LocaleDefinition;
    id_ID: LocaleDefinition;
    it: LocaleDefinition;
    ja: LocaleDefinition;
    ka_GE: LocaleDefinition;
    ko: LocaleDefinition;
    lv: LocaleDefinition;
    mk: LocaleDefinition;
    nb_NO: LocaleDefinition;
    ne: LocaleDefinition;
    nl: LocaleDefinition;
    nl_BE: LocaleDefinition;
    pl: LocaleDefinition;
    pt_BR: LocaleDefinition;
    pt_PT: LocaleDefinition;
    ro: LocaleDefinition;
    ro_MD: LocaleDefinition;
    ru: LocaleDefinition;
    sk: LocaleDefinition;
    sr_RS_latin: LocaleDefinition;
    sv: LocaleDefinition;
    th: LocaleDefinition;
    tr: LocaleDefinition;
    uk: LocaleDefinition;
    ur: LocaleDefinition;
    uz_UZ_latin: LocaleDefinition;
    vi: LocaleDefinition;
    yo_NG: LocaleDefinition;
    zh_CN: LocaleDefinition;
    zh_TW: LocaleDefinition;
    zu_ZA: LocaleDefinition;
};

/**
 * Merges the given locales into one locale.
 * The locales are merged in the order they are given.
 * The first locale that provides an entry for a category will be used for that.
 * Mutating the category entries in the returned locale will also mutate the entries in the respective source locale.
 *
 * @param locales The locales to merge.
 *
 * @returns The newly merged locale.
 *
 * @example
 * import { de_CH, de, en, mergeLocales } from '@faker-js/faker';
 *
 * const de_CH_with_fallbacks = mergeLocales([ de_CH, de, en ]);
 *
 * @since 8.0.0
 */
declare function mergeLocales(locales: LocaleDefinition[]): LocaleDefinition;

/**
 * Generates a MersenneTwister19937 randomizer with 32 bits of precision.
 * This is the default randomizer used by faker prior to v9.0.
 */
declare function generateMersenne32Randomizer(): Randomizer;
/**
 * Generates a MersenneTwister19937 randomizer with 53 bits of precision.
 * This is the default randomizer used by faker starting with v9.0.
 */
declare function generateMersenne53Randomizer(): Randomizer;

export { Faker, FakerError, LocaleDefinition, Randomizer, af_ZA, allFakers, allLocales, ar, az, base, cs_CZ, da, de, de_AT, de_CH, dv, el, en, en_AU, en_AU_ocker, en_BORK, en_CA, en_GB, en_GH, en_HK, en_IE, en_IN, en_NG, en_US, en_ZA, eo, es, es_MX, fa, fi, fr, fr_BE, fr_CA, fr_CH, fr_LU, fr_SN, generateMersenne32Randomizer, generateMersenne53Randomizer, he, hr, hu, hy, id_ID, it, ja, ka_GE, ko, lv, mergeLocales, mk, nb_NO, ne, nl, nl_BE, pl, pt_BR, pt_PT, ro, ro_MD, ru, sk, sr_RS_latin, sv, th, tr, uk, ur, uz_UZ_latin, vi, yo_NG, zh_CN, zh_TW, zu_ZA };
