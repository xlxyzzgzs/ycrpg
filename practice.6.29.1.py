import os
import shutil
from PIL import Image
import subprocess
import json
import re

from CopyData import CopyDatas

AllFile={}
FalseFile={}
PictureSize={'Animations':1,"Battlebacks1":1.72,"Battlebacks2":1.72,"Battlers":1,"Characters":1.5,"Faces":1.5,"Pictures":1.5,"Parallaxes":1.5,"Titles1":1.5,"Titles2":1.5,"Tilesets":1.5,"large":1.5,"IconSet.png":1.33,"Window.png":1.5,"Balloon.png":1.5}
PictureFileName={"Animations":"animations","Battlebacks1":"battlebacks1","Battlebacks2":"battlebacks2","Battlers":"enemies","Characters":"characters","Faces":"faces","Pictures":"pictures","Parallaxes":"parallaxes","Titles1":"titles1","Titles2":"titles2","Tilesets":"tilesets","large":"large","IconSet.png":"IconSet.png","Window.png":"Window.png"}
Data={"CommonEvents.json":"list","Actors.json":"tarits","Animations.json":None,"Armors.json":"traits","Class.json":"traits","Enemies.json":"traits","Item.json":"effects","Map*.json":"list","MapInfo.json":None,"Skills.json":"effects","State.json":"traits","System.json":None,"Tilesets.json":None,"Troops.json":"list","Weapons.json":"traits.json"}
DataList=["CommonEvents.json","Troops.json"]
SaveVarList=["save_var_world1","save_var_world2","save_var_world3","save_var_world4",]


def CopyPicture(src,dst,dstType='.png',dstSize=1):
    if not os.path.isfile(src):
        for i in os.listdir(src):
            if i in PictureSize:
                CopyPicture(os.path.join(src,i),os.path.join(dst,PictureFileName[i]),dstSize=PictureSize[i])
            else :
                CopyPicture(os.path.join(src,i),os.path.join(dst,i),dstSize=dstSize)
        return True
    dstname,dstype=os.path.splitext(dst)
    dst=dstname+dstType
    dstpath,dstname=os.path.split(dst)
    if not os.path.exists(dstpath):
        os.makedirs(dstpath)
    if os.path.exists(dst):
        #return
        os.remove(dst)
    try:
        img=Image.open(src)
        img=img.resize((int(img.width*dstSize),int(img.height*dstSize)),Image.NEAREST)
        img.save(dst)
        img.close()
        global AllFile
        AllFile[dst]=src
        return True
    except :
        print("Copy Error happens,src=",src)

ConverDict={".ogg":"1"}

def CopyMusic(src,dst,dstType='.m4a'):
    if not os.path.isfile(src):
        for i in os.listdir(src):
            CopyMusic(os.path.join(src,i),os.path.join(dst,i),dstType=dstType)
        return True
    dstname,dstype=os.path.splitext(dst)
    dst=dstname+dstType
    dstpath,dstname=os.path.split(dst)
    if not os.path.exists(dstpath):
        os.makedirs(dstpath)
    if os.path.exists(dst):
        #return
        os.remove(dst)
    error=subprocess.call(['ffmpeg','-i',src,dst])
    if error:
        FalseFile[dst]=src
    global AllFile
    AllFile[dst]=src
'''
def ChangeData(data):
    data_n=data["list"]
    numList=[0,156,157,160,161,200,199,198,197]
    for num in range(len(data_n)):
        i=data_n[num]
        if i["code"]==355 and re.match(r'((save)|(load))_var_world([0-9]*)',i["parameters"][0]):
            i["code"]=122
            num=numList[int(list(re.match(r'((save)|(load))_var_world([0-9]*)',i["parameters"][0]).groups())[-1])]
            i["parameters"]=[num,num,0,0,0]
    return data

def TurnData(src,dst):
    load_f=open(src,"r",encoding="utf-8")
    data_all=json.load(load_f)
    dstpath,dstname=os.path.split(dst)
    if re.match(r'Map([0-9]*).json',dstname):
        data=data_all["events"]
    else :
        data=data_all
    for m in range(len(data)):
        data_n=data[m]
        if data_n :
            if re.match(r'Map([0-9]*).json',dstname) or dstname=="Troops.json":
                data_n=data_n["pages"]
                for num in range(len(data_n)):
                    data_con=data_n[num]
                    ChangeData(data_con)
            else :
                ChangeData(data_n)
    save_f=open(dst,"w",encoding="utf-8")
    json.dump(data_all,save_f)

def CopyData(src,dst):
    if not os.path.isfile(src):
        for i in os.listdir(src):
            CopyData(os.path.join(src,i),os.path.join(dst,i))
        return True
    dstpath,dstname=os.path.split(dst)
    if not os.path.exists(dstpath):
        os.makedirs(dstpath)
    if os.path.exists(dst):
        pass
        #return True
        os.remove(dst)
    global AllFile
    AllFile[dst]=src
    print("Copying ",src)
    if dstname in DataList or re.match(r'Map([0-9]*).json',dstname):
        TurnData(src,dst)
    else:
        shutil.copyfile(src,dst)
    #print("Copy Error Happens,src="+src)
'''

def CopyMovie(src,dst,dstType='.mp4'):
    if not os.path.isfile(src):
        for i in os.listdir(src):
            CopyMovie(os.path.join(src,i),os.path.join(dst,i))
        return True
    dstname,dstype=os.path.splitext(dst)
    dst=dstname+dstType
    dstpath,dstname=os.path.split(dst)
    if not os.path.exists(dstpath):
        os.makedirs(dstpath)
    if os.path.exists(dst):
        return True
        os.remove(dst)
    err=subprocess.call(['ffmpeg','-i',src,'-vcodec','libx264',dst])
    if err:
        FalseFile[dst]=src
    global AllFile
    AllFile[dst]=src
    print(err)

def VerfyComplie():
    with open("result","w") as f:
        for i in AllFile.keys():
            if not os.path.exists(i):
                f.write("Error in "+AllFile[i]+' -> '+i+'\n')
        for i in FalseFile.keys():
            f.write("Error in "+FalseFile[i]+' -> '+i+'\n')



def CopyProject(src,dst):
    #CopyMusic(os.path.join(src,'Audio'),os.path.join(dst,'audio'))
    CopyPicture(os.path.join(src,'Graphics'),os.path.join(dst,'img'))
    #CopyMovie(os.path.join(src,'Movies'),os.path.join(dst,'movies'))
    #CopyData(os.path.join(src,'mv-data'),os.path.join(dst,'data'))
    VerfyComplie()

#CopyProject('vx','mv')
def CopyMid(src,dst):
    if not os.path.isfile(src):
        for i in os.listdir(src):
            CopyMid(os.path.join(src,i),os.path.join(dst,i))
        return True
    dstpath,dstname=os.path.split(dst)
    if not os.path.exists(dstpath):
        os.makedirs(dstpath)
    if not os.path.splitext(src)[1]=='.mid':
        return
    if os.path.exists(dst):
        return
        os.remove(dst)
    global AllFile
    AllFile[dst]=src
    try:
        shutil.copyfile(src,dst)
    except:
        print("Copy Error Happens,src="+src)

#CopyData(".\\data",".\\datacp")
#VerfyComplie()
'''
with open(".\\data\\CommonEvents.json","r",encoding="utf-8") as load_f:
    data=json.load(load_f)
    with open(".\\CommonEvents.json","w",encoding="utf-8") as save_f:
        json.dump(data,save_f)
    with open(".\\CommonEvents.json","r",encoding="utf-8") as f:
        d=json.load(f)
        print(d==data)
'''

def Copyfile(src,dst):
    if not os.path.isfile(src):
        for i in os.listdir(src):
            Copyfile(os.path.join(src,i),os.path.join(dst,i))
        return True
    dstpath,dstname=os.path.split(dst)
    if not re.match(r"IMG_20190704_(.*)" ,dstname):
        return
    if not os.path.exists(dstpath):
        os.makedirs(dstpath)
    if os.path.exists(dst):
        pass
        #return True
        os.remove(dst)
    global AllFile
    AllFile[dst]=src
    print("Copying ",src)
    #if dstname in DataList or re.match(r'Map([0-9]*).json',dstname):
    #    TurnData(src,dst)
    #else:
    shutil.copyfile(src,dst)
    #print("Copy Error Happens,src="+src)
CopyPicture('.\\Graphics','.\\img')
#CopyProject("va","mv")
#CopyMusic("mv\\audio","mv1\\audio",".ogg")
#CopyData("va\\mv-data","mv\\data")
VerfyComplie()