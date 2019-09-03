import sys
import nltk
from nltk.corpus import stopwords
from nltk.corpus import brown
from nltk.corpus import treebank
import numpy as np
 
Text = 'China'

def Fenchi(text):
    text_list = nltk.word_tokenize(text)
    #去掉标点符号
    english_punctuations = [',', '.', ':', ';', '?', '(', ')', '[', ']', '&', '!', '*', '@', '#', '$', '%']
    text_list = [word for word in text_list if word not in english_punctuations]
    #去掉停用词
    #stops = set(stopwords.words("english"))
    #text_list = [word for word in text_list if word not in stops]
    tokens = nltk.pos_tag(text_list)
    tree = nltk.ne_chunk(tokens)
    print(tree)
    

if __name__ == '__main__':
   Fenchi(sys.argv[1])
