import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Star, 
  Tag, 
  Info, 
  TrendingUp, 
  Sparkles,
  ThumbsUp 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface Product {
  product_id: string;
  category: string;
  subcategory: string;
  brand: string;
  price?: number;
  rating?: number;
}

interface AIAnalysis {
  recommendation_reason: string;
}

interface ProductRecommendationsProps {
  products: Array<Product & AIAnalysis> | null;
  loading: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ProductRecommendations = ({ products, loading }: ProductRecommendationsProps) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  if (loading) {
    return (
      <Card className="h-full border-none shadow-lg bg-gradient-to-br from-violet-50/90 to-indigo-50/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-violet-900">
            <Sparkles className="inline mr-2 h-5 w-5 text-violet-600" /> 
            <span className="font-medium">AI is Finding Your Perfect Products...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                className="p-4 border rounded-lg bg-white/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="h-5 bg-gradient-to-r from-violet-200 to-indigo-200 animate-pulse rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-violet-100 to-indigo-100 animate-pulse rounded w-1/2 mb-1"></div>
                <div className="h-4 bg-gradient-to-r from-violet-100 to-indigo-100 animate-pulse rounded w-3/4"></div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card className="h-full border-none shadow-lg bg-gradient-to-br from-violet-50/90 to-indigo-50/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-violet-900">
            <Sparkles className="inline mr-2 h-5 w-5 text-violet-600" /> 
            <span className="font-medium">AI-Powered Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="flex flex-col items-center justify-center h-48 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag className="h-12 w-12 text-violet-300 mb-3" />
            <p className="text-muted-foreground text-base">Enter a customer ID to view personalized product recommendations</p>
            <p className="text-sm text-violet-400 mt-2">Our AI will analyze shopping patterns to find perfect matches</p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-lg bg-gradient-to-br from-violet-50/90 to-indigo-50/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-violet-900">
          <Sparkles className="mr-2 h-5 w-5 text-violet-600" /> 
          <span className="font-medium">AI-Powered Recommendations</span>
          <Badge variant="outline" className="ml-2 bg-violet-100 text-violet-700 border-violet-200">
            {products.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {products.map((product, index) => {
            // Ensure we always have a reason to display
            let reasonText = product.recommendation_reason;
            if (!reasonText || reasonText.trim() === "") {
              reasonText = `This ${product.category.toLowerCase()} from ${product.brand} aligns with your recent browsing patterns and purchase history. Our AI believes you'll appreciate its features based on your preferences.`;
            } else if (reasonText.startsWith("AI Analysis:")) {
              reasonText = reasonText.replace("AI Analysis:", "").trim();
            }
            
            const isHovered = hoveredProduct === product.product_id;
            
            return (
              <motion.div 
                key={index} 
                className={`p-4 border rounded-lg transition-all duration-300 shadow-sm ${
                  isHovered ? 'shadow-md scale-[1.01]' : 'hover:shadow-md'
                } bg-gradient-to-r from-white/80 to-violet-50/80 backdrop-blur-md`}
                variants={item}
                onMouseEnter={() => setHoveredProduct(product.product_id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white mr-3">
                      {product.brand.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-medium text-violet-900">
                      {product.product_id}
                      {product.rating && (
                        <span className="flex items-center text-amber-500 text-sm ml-1">
                          <Star className="h-3.5 w-3.5 fill-amber-500 mr-0.5" />
                          {product.rating.toFixed(1)}
                        </span>
                      )}
                    </h3>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Badge className="bg-violet-100 hover:bg-violet-200 text-violet-800 border-none">
                        {product.brand}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64">
                      <div className="flex justify-between space-x-4">
                        <div>
                          <h4 className="text-sm font-semibold">{product.brand}</h4>
                          <p className="text-sm text-muted-foreground">
                            Top brand in {product.category.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  <span className="text-violet-700 font-medium">{product.category}</span>
                  <span className="mx-1">›</span>
                  <span className="text-violet-600">{product.subcategory}</span>
                  
                  {product.price && (
                    <Badge className="ml-auto bg-green-100 text-green-800 border-none">
                      ${product.price.toFixed(2)}
                    </Badge>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-violet-100">
                  <div className="flex items-start">
                    <ThumbsUp className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${
                      isHovered ? 'text-violet-600 animate-pulse' : 'text-violet-400'
                    }`} />
                    <p className="text-sm text-gray-700">{reasonText}</p>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-3 py-1 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
