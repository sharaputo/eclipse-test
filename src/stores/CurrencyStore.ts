import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import useFetch from '@/composables/useFetch';
import type CurrencyObject from '@/@types/CurrencyObject';

export const useCurrencyStore = defineStore('currencyStore', () => {
  const currenciesList = ref<string[]>([]);
  const currenciesDetails = ref<CurrencyObject[]>([]);

  const getCurrencies = (): void => {
    const API = new useFetch('https://www.cbr-xml-daily.ru');

    API.get('/daily_json.js')
      .then((data) => {
        if (data) {
          const currencies: object = data.Valute;

          Object.entries(currencies).forEach(([key, value]) => {
            currenciesList.value.push(key);
            currenciesDetails.value.push(value);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const currencyDetails = ref<CurrencyObject>();
  const getCurrencyDetails = (option: string): void => {
    currencyDetails.value = currenciesDetails?.value.find(
      (item) => item.CharCode === option,
    );
  };

  const sortedCurrenciesList = ref<string[]>(currenciesList.value);
  const filterCurrenciesList = (input: string): void => {
    if (input) {
      sortedCurrenciesList.value = currenciesList.value.filter((item) =>
        item.includes(input.toUpperCase()),
      );
    } else {
      sortedCurrenciesList.value = currenciesList.value;
    }
  };

  onMounted(() => {
    getCurrencies();
  });

  return {
    sortedCurrenciesList,
    currencyDetails,
    getCurrencyDetails,
    filterCurrenciesList,
  };
});
