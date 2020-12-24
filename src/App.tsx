import React, {useEffect, useState} from 'react';
import './App.css';
import SvgIcons from "./SvgIcons";
import {
    useWindowSize,
    useWindowWidth,
    useWindowHeight,
} from '@react-hook/window-size'

interface Synonym {
    text: string,
    type: string
}

function App() {

    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [openMainInput, setOpenMainInput] = useState<boolean>(true);
    const [disable, setDisable] = useState<boolean>(false);
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [Synonyms, setSynonyms] = useState<Synonym[]>([]);
    const [width] = useWindowSize();


    let listOfSomeEntities = [
        {
            name: 'a',
            children: [{
                name: 'a1',
                children: [{
                    name: 'a11'
                }]
            }, {
                name: 'a2',
                children: [{
                    name: 'a21'
                }]
            }]
        }, {
            name: 'b'
        }, {
            name: 'c',
            children: [{
                name: 'c1',
                children: [{
                    name: 'c11'
                }, {
                    name: 'c12',
                }]
            }]
        }
    ]

    let res:any = []

    const func = (obj:any,prev:any) => {
        const string = `${prev} >`
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].name) {
                res.push(`${string} ${obj[i].name}`)
            }
            if (obj[i].children !== undefined) {
                func(obj[i].children,`${string} ${obj[i].name}`)
            }
        }
    }

    const test = () => {
      for (let i = 0; i < listOfSomeEntities.length; i++) {
          if (listOfSomeEntities[i].name) {
              res.push(listOfSomeEntities[i].name)
          }
          if (listOfSomeEntities[i].children !== undefined) {
              func(listOfSomeEntities[i].children,listOfSomeEntities[i].name)
          }
      }

      console.log(res)
    }

    let result = [
        'a',
        'a > a1',
        'a > a2',
        'a > a2 > a21',
        'b',
        'c',
        'c > c1',
        'c > c1 > c11',
        'c > c1 > c12',
    ];

    useEffect(() => {
        const arr = localStorage.getItem('Synonyms')
        arr && setSynonyms(JSON.parse(arr))
        test(listOfSomeEntities)
    }, [])

    useEffect(() => {

    }, [width])

    useEffect(() => {
        value !== '' && setError('')
    }, [value])

    useEffect(() => {
        if (Synonyms.filter(item => item.type === 'edit').length !== 0) {
            setOpenMainInput(false)
        } else {
            setOpenMainInput(true)
        }
    }, [Synonyms])

    const handleSubmit = () => {
        if (value !== '') {
            setIsLoader(true)
            setTimeout(() => {
                setIsLoader(false)
                value && addSynonym(value)
                setValue('')
            }, 2000)
        } else {
            setError('Поле не должно быть пустым!')
        }
    };

    const removeSynonym = (index: number) => {
        const newTasks = [...Synonyms];
        newTasks.splice(index, 1);
        setSynonyms(newTasks);
    };

    const editSynonym = (ind: number) => {
        setOpenMainInput(false)
        const newTasks = Synonyms
        newTasks[ind].text = Synonyms[ind].text
        newTasks[ind].type = 'edit'
        const editTasks = [...newTasks]
        setSynonyms(editTasks);
    };

    const editElement = (text: string, item: Synonym, index: number) => {
        const changeSynonyms = Synonyms
        changeSynonyms[index].text = text;
        changeSynonyms[index].type = 'edit';
        setSynonyms([...changeSynonyms])
    }

    const saveEditSynonym = (item: Synonym, index: number) => {
        const changeSynonyms = Synonyms
        changeSynonyms[index].text = changeSynonyms[index].text;
        changeSynonyms[index].type = 'stable';
        setSynonyms([...changeSynonyms])
        setOpenMainInput(false)
    }

    const addSynonym = (text: string) => {
        setSynonyms([...Synonyms, {text, type: 'stable'}])
        setValue('')
    }

    const clearSynonyms = () => {
        setSynonyms([])
        localStorage.clear()
    }

    const saveSynonyms = () => {
        localStorage.setItem('Synonyms', JSON.stringify(Synonyms));
    }

    const title = (text: string) => {
        if (width <= 600) {
            return `${text.substr(0, 31)}...`
        } else {
            return text
        }
    }

    return (
        <div className='App'>
            <div className='modalWrapper'>
                <div>
                    <div className='titleModal'>{title('Редактирование группы синонимов поисковых фраз')}</div>
                    <SvgIcons type={'close'} style={{position: 'absolute', right: 20, top: 20}}/>
                    <div className='wrapperForm'>
                        <div className='titleFormWrapper'>
                            <div className='titleForm'>
                                Синонимы
                            </div>
                            <SvgIcons type={'info'}/>
                        </div>
                        {
                            openMainInput && <div className='wrapperInput'>
                                <div className='label'>Добавление синонима:</div>
                                <input value={value} onChange={(e) => setValue(e.target.value)} type="text"
                                       placeholder='Введите название'/>
                                {error && <div className='error'><SvgIcons type={'error'}/> {error}</div>}
                                <button disabled={disable} style={{
                                    pointerEvents: disable || isLoader ? "none" : "auto",
                                    opacity: disable && isLoader ? 0.5 : 1,
                                }} onClick={() => handleSubmit()}>{isLoader ?
                                    <div className='loader'><SvgIcons type={'loader'}/></div> : 'добавить'}</button>
                            </div>
                        }
                        <div className='listWords'>
                            {Synonyms.map(({text, type}, index) => (
                                type !== 'edit' ?
                                    <div style={{marginBottom: Synonyms.length - 1 === index ? 10 : 0}}
                                         key={index + text}
                                         className='item'>
                                        <div className='titleElement'>{text}</div>
                                        <div className='controlElement'>
                                            <div onClick={() => editSynonym(index)}>
                                                <SvgIcons type={'pen'} style={{marginRight: 10}}/>
                                            </div>
                                            <div onClick={() => removeSynonym(index)}>
                                                <SvgIcons type={'delete'}/>
                                            </div>
                                        </div>
                                    </div> :
                                    <div className='wrapperInput'>
                                        <div className='label'>редактирование синонима:</div>
                                        <input value={text}
                                               onChange={(e) => editElement(e.target.value, {text, type}, index)}
                                               type="text"
                                               placeholder='Введите название'/>
                                        <button onClick={() => saveEditSynonym({text, type}, index)}>сохранить</button>
                                    </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='mainControlButton'>
                    <button onClick={saveSynonyms} className='saveButton'>cохранить изменения</button>
                    <button onClick={clearSynonyms} className='clearButton'>очистить синонимы</button>
                </div>
            </div>
        </div>
    );
}

export default App;
