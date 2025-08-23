"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import cities from "@/mocks/cities.json";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSearchCriteria } from "@/store/slices/searchSlice";
import { CalendarDays, Search, MapPin } from "lucide-react";
import { FormikSelect } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

export function SearchBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const today = new Date().toISOString().slice(0, 10);
  
  // Redux'tan önceki arama kriterlerini al
  const searchCriteria = useAppSelector((state) => state.search);
  
  // Validation schema
  const SearchSchema = Yup.object({
    fromCity: Yup.string().required(t("search.selectDepartureCityError")),
    toCity: Yup.string().required(t("search.selectArrivalCityError")),
    date: Yup.string().required(t("search.selectDateError")),
  });

  // Initial values - Redux'ta değer varsa kullan, yoksa default
  const initialValues = {
    fromCity: searchCriteria.fromCity || "",
    toCity: searchCriteria.toCity || "",
    date: searchCriteria.date || today
  };

  return (
       <div className="w-full mt-6 mb-6 sm:mt-8 sm:mb-8 md:mt-12 bg-white/90 backdrop-blur border rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-8 shadow-[0_6px_20px_rgba(0,0,0,0.06)] overflow-visible">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={SearchSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values) => {

          const { fromCity, toCity, date } = values;
          
          // Redux store'a kaydet
          dispatch(setSearchCriteria({ fromCity, toCity, date }));
          router.push("/inquiry");
        }}
      >
        {({ values, setValues, errors, touched }) => {
          // Destination için available cities (origin hariç)
          const availableDestinations = cities.filter(city => city !== values.fromCity);
          
          return (
          <Form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
            {/* Origin */}
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              <label className="text-xs sm:text-sm md:text-base font-medium text-gray-700">{t('search.from')}</label>
              <div className="relative">
                <FormikSelect 
                  name="fromCity" 
                  options={cities} 
                  placeholder={t('search.selectDepartureCity')}
                  className="w-full rounded-xl sm:rounded-2xl bg-white border border-gray-300 px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 md:py-4 pl-10 sm:pl-12 md:pl-14 pr-10 sm:pr-12 md:pr-14 text-sm md:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-search-button-color focus:border-transparent text-left"
                  leftIcon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                />
              </div>
              {errors.fromCity && touched.fromCity && !values.fromCity && (
                <div className="text-red-500 text-xs mt-1">{errors.fromCity}</div>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              <label className="text-xs sm:text-sm md:text-base font-medium text-gray-700">{t('search.to')}</label>
              <div className="relative">
                <FormikSelect 
                  name="toCity" 
                  options={availableDestinations} 
                  placeholder={t('search.selectArrivalCity')}
                  className="w-full rounded-xl sm:rounded-2xl bg-white border border-gray-300 px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 md:py-4 pl-10 sm:pl-12 md:pl-14 pr-10 sm:pr-12 md:pr-14 text-sm md:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-search-button-color focus:border-transparent text-left"
                  leftIcon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                />
              </div>
              {errors.toCity && touched.toCity && !values.toCity && (
                <div className="text-red-500 text-xs mt-1">{errors.toCity}</div>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              <label className="text-xs sm:text-sm md:text-base font-medium text-gray-700">{t('search.date')}</label>
              <div className="relative">
                <CalendarDays className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-500 flex items-center" />
                <Field 
                  type="date" 
                  name="date" 
                  min={today} 
                  className="w-full rounded-xl sm:rounded-2xl bg-white border border-gray-300 px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 md:py-4 pl-10 sm:pl-12 md:pl-14 text-sm md:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ colorScheme: 'light' }}
                />
              </div>
              {errors.date && touched.date && !values.date && (
                <div className="text-red-500 text-xs mt-1">{errors.date}</div>
              )}
            </div>

            {/* Search Button */}
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Search}
                fullWidth
                mobileText="Ara"
                className="search-button-color text-search-button-color-text rounded-xl sm:rounded-2xl px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm md:text-base font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {t('search.searchTrips')}
              </Button>
            </div>
          </Form>
          );
        }}
      </Formik>
    </div>
  );
}


