import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { productData } from '../data/products';

const TopRatedProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const allProducts = useMemo(() => {
    return Object.entries(productData).flatMap(([category, items]) =>
      items.map(item => ({ ...item, productCategory: category }))
    );
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.productCategory === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [searchQuery, selectedCategory, priceRange, minRating, allProducts]);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'sheets', name: 'Sheets', icon: '🛏️' },
    { id: 'sleepwear', name: 'Sleepwear', icon: '👕' },
    { id: 'blankets', name: 'Blankets', icon: '🧶' },
    { id: 'pillowcases', name: 'Pillowcases', icon: '💫' },
    { id: 'accessories', name: 'Accessories', icon: '✨' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredProducts.map((product, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": product.name,
      "image": product.image,
      "description": product.description,
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": Math.floor(Math.random() * 100) + 50
      }
    }))
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Top-Rated Bamboo Products | Expert Reviews & Recommendations</title>
        <meta name="description" content="Discover our selection of top-rated bamboo products, from luxurious sheets to comfortable sleepwear. Expert-tested and customer-approved for the best sleep experience." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Top-Rated Bamboo Products
        </h1>

        {/* Main Category Navigation */}
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                  category.id === selectedCategory
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-green-50 dark:hover:bg-gray-700 shadow-md'
                }`}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Refine
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range Filter */}
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[80px]">
                  Up to ${priceRange[1]}
                </span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold mb-3">Minimum Rating</h3>
              <div className="flex items-center gap-2">
                {[4, 4.5, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      minRating === rating
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800'
                    }`}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    {rating}+
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Showing {filteredProducts.length} products
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <article key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <ProductCard {...product} />
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-gray-600 dark:text-gray-300">{product.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
                <div className="space-y-2">
                  <span className="inline-block mr-2 mb-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                    {product.productCategory}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No products found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedProducts;