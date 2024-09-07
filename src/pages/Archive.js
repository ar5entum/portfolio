import React, { PureComponent } from 'react'

export default class Archive extends PureComponent {
  render() {
    return (
        <div className='flexContainer'>
        <div className='contentContainer'>
                    <h3>Works</h3>
                    <div className='content'>
                      <p>HuggingFace Models</p>
                      <a href="https://huggingface.co/ar5entum/bart_rom_dev_tl" className='huggingface'>
                          ar5entum/bart_rom_dev_tl
                        <p className="hf-description">Bart machine transliteration for roman to devnagiri.</p>
                      </a>
                      <a href="https://huggingface.co/ar5entum/bart_dev_rom_tl" className='huggingface'>
                          ar5entum/bart_dev_rom_tl
                        <p className="hf-description">Bart machine transliteration for devnagiri to roman.</p>
                      </a>
                      <a href="https://huggingface.co/ar5entum/bart_eng_hin_mt" className='huggingface'>
                          ar5entum/bart_eng_hin_mt
                        <p className="hf-description">Bart machine translation for english to hindi.</p>
                      </a>
                      <a href="https://huggingface.co/ar5entum/bart_hin_eng_mt" className='huggingface'>
                          ar5entum/bart_hin_eng_mt
                        <p className="hf-description">Bart machine translation for hindi to english.</p>
                      </a>
                      <a href="https://huggingface.co/ar5entum/marianMT_hin_eng_cs" className='huggingface'>
                          ar5entum/marianMT_hin_eng_cs
                        <p className="hf-description">This MarianMT based model effectively handles the complexities of code-switching, producing output that accurately reflects the intended language mixing.</p>
                      </a>
                      <p>HuggingFace Datasets</p>
                      <a href="https://huggingface.co/datasets/ar5entum/hindi-english-roman-devnagiri-transliteration-corpus" className='huggingface'>
                          ar5entum/hindi-english-roman-devnagiri-transliteration-corpus
                        <p className="hf-description">Transliteration corpus for roman and devnagiri.</p>
                      </a>
                      <a href="https://huggingface.co/datasets/ar5entum/hindi-english-code-mixed" className='huggingface'>
                          ar5entum/hindi-english-code-mixed
                        <p className="hf-description">Code mixed dataset for hindi to hinglish (hindi english code mixed).</p>
                      </a>
                    </div>
                    <div className='content'>
                      <p>CNN brain tumor detection</p>
                      <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7094910522713681921?compact=1" height="85%" frameborder="1" allowfullscreen="" title="Embedded post"></iframe>
                    </div>
        
                    <div className='content'>
                      <p>Semantic segmentation of Plants using detectron2</p>
                      <iframe src="https://www.kaggle.com/embed/ar5entum/semantic-segmentation-of-plants-with-detectron-2?kernelSessionId=143942368" height="85%" frameborder="0" scrolling="auto" title="semantic-segmentation-of-plants with detectron 2"></iframe>
                    </div>
        
                    <div className='content'>
                      <p>Cancer_Data PCA with SVC (97% accuracy)</p>
                      <iframe src="https://www.kaggle.com/embed/ar5entum/cancer-data-pca-with-svc-97-accuracy?kernelSessionId=127867507" height="85%" frameborder="0" scrolling="auto" title="Cancer_Data PCA with SVC (97% accuracy)"></iframe>
                    </div>
                  </div>
                  
                
                </div>
    )
  }
}
