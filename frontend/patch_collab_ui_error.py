with open("src/collab/components/test/MockTest.jsx", "r") as f:
    text = f.read()

text = text.replace(
    "setError('Failed to generate AI Test');",
    "setError(err.response?.data?.detail || 'Failed to generate AI Test');"
)

with open("src/collab/components/test/MockTest.jsx", "w") as f:
    f.write(text)
