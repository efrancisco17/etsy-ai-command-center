import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id?: string;
  name: string;
  description: string;
  keywords: string[];
  tags: string[];
  price: string;
  created_at?: string;
}

export const productService = {
  async saveProduct(product: Product) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        keywords: product.keywords,
        tags: product.tags,
        price: product.price
      }])
      .select();

    if (error) {
      console.error('Supabase error details:', error);
      throw new Error(`Failed to save product: ${error.message}. Please check your Supabase configuration.`);
    }
    return data;
  },

  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};
