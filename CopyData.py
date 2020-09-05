
import os
import shutil
import json
import re

class CopyDatas():

    CopyList={}

    def __init__(self,src,dst):
        if not os.path.exists(src):
            return 
        self.src=src
        self.dst=dst
        self.json=None
        self.srcname=None
        try:
            self.CopyData(self.src,self.dst)
        except json.decoder.JSONDecodeError:
            pass
        #self.VerfyComplie()

    def CopyData(self,src,dst):
        if not os.path.isfile(src):
            for i in os.listdir(src):
                CopyDatas(os.path.join(src,i),os.path.join(dst,i))
                #self.CopyData(os.path.join(src,i),os.path.join(dst,i))
            return True
        self.srcname=os.path.split(src)[1]
        dstpath=os.path.split(dst)[0]
        if self.isMap():
            self.MapID=list(re.match(r'Map([0-9]*).json',self.srcname).groups())[-1]
            self.srcname="Map"
        if dstpath != '' and not os.path.exists(dstpath):
            os.makedirs(dstpath)
        if os.path.exists(dst):
            pass
            #return True
            os.remove(dst)
        self.CopyList[dst]=src
        print("Copying ",src)
        self.ChangeData()
        self.Save()


    def VerfyComplie(self):
        with open("result","w") as f:
            for i in self.CopyList.keys():
                if not os.path.exists(i):
                    f.write("Error in "+self.CopyList[i]+' -> '+i+'\n')

    def ChangeData(self):
        with open(self.src,"r",encoding="utf-8") as load_f:
            self.json=json.load(load_f)
        if not (self.srcname in self.funcdist.keys()):
            return
        for func in self.funcdist[self.srcname]:
            func(self)
        
    def Save(self):
        with open(self.dst,"w",encoding="utf-8") as save_f:
            json.dump(self.json,save_f,ensure_ascii=False)#,indent=4)

    def isMap(self):
        return re.match(r'Map([0-9]*).json',self.srcname)
    
    def TurnOffEvents(self):
        TurnOffID=[21,37,38,41,50,51,52,53,54]
        for i in TurnOffID:
            self.json[i]["trigger"]=0
    
    def ChangeLoadVarEvent(self):
        numList=[0,156,157,160,161,200,199,198,197]
        for event in self.json[1:] :
            for code in event["list"] :
                if code["code"]==355 and re.match(r'((save)|(load))_var_world([0-9]*)',code["parameters"][0]):
                    code["code"]=122
                    num=numList[int(list(re.match(r'((save)|(load))_var_world([0-9]*)',code["parameters"][0]).groups())[-1])]
                    code["parameters"]=[num,num,0,0,0]

    def ChangeLoadVarMap(self):
        numList=[0,156,157,160,161,200,199,198,197]
        for event in self.json["events"]:
            if event == None :
                continue
            for page in event["pages"]:
                for code in page["list"]:
                    if code["code"]==355 and re.match(r'((save)|(load))_var_world([0-9]*)',code["parameters"][0]):
                        code["code"]=122
                        num=numList[int(list(re.match(r'((save)|(load))_var_world([0-9]*)',code["parameters"][0]).groups())[-1])]
                        code["parameters"]=[num,num,0,0,0]

    def ShowNameAboveMapEvent(self):
        for event in self.json["events"][1:]:
            if event == None :
                continue
            if bool(re.match(r'<namepop ([^>]*)>',event['name'])):
                print(str((re.match(r'<namepop ([^>]*)>',event['name']).groups())[-1]))
                event['pages'][0]['list'].insert(0,json.loads('{"code":108,"indent":0,"parameters":["<Mini Label: %s>"]}'%str((re.match(r'<namepop ([^>]*)>',event['name']).groups())[-1])))
        

    def ChangeEquipType(self):
        self.json["equipTypes"]=[
        "",
        "右手",
        "头盔",
        "铠甲",
        "饰品",
        "左手"
        ]
        self.json['gameTitle']='异常生物见闻录'

    def ChangeWeaponDisableTypeFromWeaponToLeftHand(self):
        for weapon in self.json[1:] :
            for code in weapon["traits"] :
                if code['code']==54 and code['dataId'] == 1:
                    code['dataId']=5

    def AddItemSynthesis(self):
        ItemSynthesisDict={ #key 为 itemID ，value 为 写入note 的内容
            #'2':'<Synthesis Ingredients>\nitem 1: 2\ngold: 10\n</Synthesis Ingredients>',
            #'3':'<Synthesis Ingredients>\nitem 1: 1\nitem 2: 1\ngold: 100\n</Synthesis Ingredients>',
            #'9':'<Synthesis Ingredients>\nitem 1: 10\ngold: 500\n</Synthesis Ingredients>',
            '22':'<Item Recipe: '+str(list(range(1,78)))[1:-1]+'>\n<Weapon Recipe: '+str(list(range(1,99)))[1:-1]+'>\n<Armor Recipe: '+str(list(range(1,80)))[1:-1]+'>',
            'other':'<Synthesis Ingredients>\nitem 22: 0\ngold: 0\n</Synthesis Ingredients>\n'
        }
        #for num in ItemSynthesisDict.keys():
            #self.json[int(num)]['note']=self.json[int(num)]['note']+'\n'+ItemSynthesisDict[num]
        for item in self.json:
            if not item:
                continue
            if str(item['id']) in ItemSynthesisDict.keys():
               item['note']=item['note']+'\n'+ItemSynthesisDict[str(item['id'])]
            else :
               item['note']=item['note']+'\n'+ItemSynthesisDict['other']
        
    def AddWeaponSynthesis(self):
        WeaponSynthesisDict={
            #'3':'<Synthesis Ingredients>\nweapon 1: 2\nweapon 2:1\ngold: 50\n</Synthesis Ingredients>',
            #'6':'<Synthesis Ingredients>\nweapon 3: 2\nitem 17:0\ngold: 600\n</Synthesis Ingredients>',
            #'74':'<Synthesis Ingredients>\nitem 39:1\ngold: 1600\n</Synthesis Ingredients>',
            'other':'<Synthesis Ingredients>\nitem 22: 0\ngold: 0\n</Synthesis Ingredients>\n'
        }
        for weapon in self.json:
            if not weapon:
                continue
            if str(weapon['id']) in WeaponSynthesisDict.keys():
               weapon['note']=weapon['note']+'\n'+WeaponSynthesisDict[str(weapon['id'])]
            else :
               weapon['note']=weapon['note']+'\n'+WeaponSynthesisDict['other']

    def AddArmorSynthesis(self):
        ArmorSynthesisDict={
            #'2':'<Synthesis Ingredients>\narmor 1: 2\ngold: 40\n</Synthesis Ingredients>',
            #'5':'<Synthesis Ingredients>\narmor 2: 1\nweapon 2: 2\nitem 9:0\ngold: 400\n</Synthesis Ingredients>',
            'other':'<Synthesis Ingredients>\nitem 22: 0\ngold: 0\n</Synthesis Ingredients>\n'
        }
        for arrmor in self.json:
            if not arrmor:
                continue
            if str(arrmor['id']) in ArmorSynthesisDict.keys():
               arrmor['note']=arrmor['note']+'\n'+ArmorSynthesisDict[str(arrmor['id'])]
            else :
               arrmor['note']=arrmor['note']+'\n'+ArmorSynthesisDict['other']

    def MoveMapEvents(self):
        EventPositionDict={ #key 为MapID，value为列表，每个数据都是元组，元组的第一个为eventID 剩下两个为新位置 x , y
            #'012':[(10,4,22),(12,7,22)]
        }
        if str(self.MapID) in EventPositionDict.keys():
            for EventPosition in EventPositionDict[str(self.MapID)] :
                self.json['events'][EventPosition[0]]['x']=EventPosition[1]
                self.json['events'][EventPosition[0]]['y']=EventPosition[2]

    def ChangeMapScriptCall(self):
        ChangeEventDict={ #改变scriptCall 输入第一句，第一句相同则覆写后续所有的ScriptCall
            'NotPrepared':['{{"code":101,"indent":{0},"parameters":["",0,0,2]}}','{{"code":401,"indent":{0},"parameters":["暂未开发，敬请期待"]}}']
        }
        for event in self.json["events"]:
            if not event :
                continue
            for page in event['pages']:
                mode=0
                for code,codeID in zip(page['list'][:],range(len(page['list'][:]))):
                    if mode==0 and code['code']==355:
                        indent=code['indent']
                        page['list'].remove(code)
                        if code['parameters'][0] in ChangeEventDict.keys() :
                            temp=[json.loads(x.format(indent)) for x in ChangeEventDict[code['parameters'][0]]]
                            for tempcode in temp[::-1]:
                                page['list'].insert(codeID,tempcode)
                        else :
                            temp=[json.loads(x.format(indent)) for x in ChangeEventDict['NotPrepared']]
                            for tempcode in temp[::-1]:
                                page['list'].insert(codeID,tempcode)
                        mode = 1  
                    elif mode==1 and code['code']==655 :
                        page['list'].remove(code)
                    elif mode==1 and code['code']!=355 and code['code']!=655 :
                        mode=0
                    else :
                        #raise BaseException("错误信息") 
                        pass


    def ChangeEventsScriptCall(self):
        ChangeEventDict={ #改变scriptCall 按eventID 改，输入第一句，第一句相同则覆写后续所有的ScriptCall
            'recipe_all_switch_on':['{{"code":356,"indent":{0},"parameters":["OpenSynthesis"]}}'],
            'NotPrepared':['{{"code":101,"indent":{0},"parameters":["",0,0,2]}}','{{"code":401,"indent":{0},"parameters":["暂未开发，敬请期待"]}}']
        }
        mode=0 #代表查找

        for event in self.json:
            mode = 0
            if event == None :
                continue
            for code,codeID in zip(event['list'][:],range(len(event['list'][:]))):
                if mode==0 and code['code']==355:
                    indent=code['indent']
                    event['list'].remove(code)
                    if code['parameters'][0] in ChangeEventDict.keys() :
                        temp=[json.loads(x.format(indent)) for x in ChangeEventDict[(code['parameters'][0])]]
                        for tempcode in temp[::-1]:
                            event['list'].insert(codeID,tempcode)
                    else:
                        temp=[json.loads(x.format(indent)) for x in ChangeEventDict['NotPrepared']]
                        for tempcode in temp[::-1]:
                            event['list'].insert(codeID,tempcode)
                    mode = 1  
                elif mode==1 and code['code']==655 :
                    event['list'].remove(code)
                elif mode==1 and code['code']!=355 and code['code']!=655 :
                    mode=0
                else :
                    #raise BaseException("错误信息") 
                    pass
    def AddMiniMapEventNote(self):
        for event in self.json['events']:
            if not event:
                continue
            HaveEvent=False
            for page in event['pages']:
                if page['trigger']<2 and len(page['list'])>1:
                    HaveEvent=True
                    break
            if HaveEvent:
                event['note']=event['note']+'<mmDisplay>\n'+'<mmColor:rgba(175,0,0,1)>'
    def AddMapNameForMiniMap(self):
        '''
        with open(os.path.join(os.path.split(self.src)[0],'Mapinfos.json'),'r',encoding='utf8') as Map:
            MapInfo=json.load(Map)
            self.json['note']=self.json['note']+str('<mmName:%s>'%MapInfo[int(self.MapID)]['name']) 
        '''
        pass
    
    def ChangeTroopsCodeById(self):
        ChangeDict={
            '100':[[1,313,[0,0,0,78],['{{"code":117,"indent":{0},"parameters":[57]}}']]]
        }
        for num in ChangeDict.keys():
            troop=self.json[int(num)]
            for key in ChangeDict[num]:
                lists=troop['pages'][key[0]]['list']
                for code,codeID in zip(lists,range(len(lists[:]))):
                    mode=0  #代表查找
                    if code['code']==key[1] and code['parameters'] == key[2]:
                        indent=code['indent']
                        lists.remove(code)
                        temp=[json.loads(x.format(indent)) for x in key[3]]
                        for tempcode in temp[::-1]:
                            lists.insert(codeID,tempcode)
                    elif mode==1 and code['code']==key[1]+300 :
                        lists.remove(code)
                    elif mode==1 and code['code']!=key[1] and code['code']!=key[1]+300 :
                        mode=0
                    else :
                        #raise BaseException("错误信息") 
                        pass

    def ChangeJoinTeamMap(self):
        '''
        for event in self.json['events']:
            if not event:
                continue
            for page in event['pages']:
                for code,codeID in zip(page['list'],range(page['list'][:])):
                    if code['code']==129 and not code['parameters'][0] in [14]:#
                        page['list'][codeID]['parameters'][2]=0
        '''
        pass

    funcdist={
        'Map':[ChangeLoadVarMap,MoveMapEvents,ChangeMapScriptCall,ShowNameAboveMapEvent,AddMiniMapEventNote,AddMapNameForMiniMap],
        'CommonEvents.json':[TurnOffEvents,ChangeLoadVarEvent,ChangeEventsScriptCall],
        'System.json':[ChangeEquipType],
        'Weapons.json':[ChangeWeaponDisableTypeFromWeaponToLeftHand,AddWeaponSynthesis],
        'Items.json':[AddItemSynthesis],
        'Armors.json':[AddArmorSynthesis],
        'Troops.json':[ChangeTroopsCodeById]
    }

Temp=CopyDatas(".\\mv-data",".\\data")

