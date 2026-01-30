#!/bin/bash
cd /home/kavia/workspace/code-generation/gadget-store-with-real-time-delivery-tracking-207745-207755/shop_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

