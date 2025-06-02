from setuptools import setup, find_packages

setup(
    name="deckcalculator",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'Flask==3.0.0',
        'python-dotenv==1.0.0',
        'gunicorn==21.2.0',
    ],
)
