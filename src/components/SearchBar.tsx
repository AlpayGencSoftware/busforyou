"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import cities from "@/mocks/cities.json";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSearchCriteria } from "@/store/slices/searchSlice";
import { CalendarDays, Search, MapPin } from "lucide-react";
import { FormikSelect } from "@/components/ui/Select";

const SearchSchema = Yup.object({
  fromCity: Yup.string().required("Kalkış şehri seçiniz"),
  toCity: Yup.string().required("Varış şehri seçiniz"),
  date: Yup.string().required("Seyahat tarihi seçiniz"),
});

export function SearchBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const today = new Date().toISOString().slice(0, 10);
  
  // Redux'tan önceki arama kriterlerini al
  const searchCriteria = useAppSelector((state) => state.search);
  
  // Initial values - Redux'ta değer varsa kullan, yoksa default
  const initialValues = {
    fromCity: searchCriteria.fromCity || "",
    toCity: searchCriteria.toCity || "",
    date: searchCriteria.date || today
  };

  return (
       <div className="w-full mt-8 mb-8 md:mt-12 bg-white/90 backdrop-blur border rounded-2xl md:rounded-3xl p-1 md:p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)] overflow-visible">
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
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {/* Origin */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700">Nereden</label>
              <div className="relative">
                <FormikSelect 
                  name="fromCity" 
                  options={cities} 
                  placeholder="Kalkış şehri seçin"
                  className="w-full rounded-2xl bg-white border border-gray-300 px-4 py-3 pl-10 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>
              {errors.fromCity && touched.fromCity && !values.fromCity && (
                <div className="text-red-500 text-xs mt-1">{errors.fromCity}</div>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700">Nereye</label>
              <div className="relative">
                <FormikSelect 
                  name="toCity" 
                  options={availableDestinations} 
                  placeholder="Varış şehri seçin"
                  className="w-full rounded-2xl bg-white border border-gray-300 px-4 py-3 pl-10 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>
              {errors.toCity && touched.toCity && !values.toCity && (
                <div className="text-red-500 text-xs mt-1">{errors.toCity}</div>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700">Tarih</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Field 
                  type="date" 
                  name="date" 
                  min={today} 
                  className="w-full rounded-2xl bg-white border border-gray-300 px-4 py-3 pl-10 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ colorScheme: 'light' }}
                />
              </div>
              {errors.date && touched.date && !values.date && (
                <div className="text-red-500 text-xs mt-1">{errors.date}</div>
              )}
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full search-button-color text-search-button-color-text rounded-2xl px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Search className="w-4 h-4 search-icon" />
                Sefer Ara
              </button>
            </div>
          </Form>
          );
        }}
      </Formik>
    </div>
  );
}


